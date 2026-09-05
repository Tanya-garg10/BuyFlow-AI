import { PolicyEvaluation } from '../src/types';
import { store } from './store';

export type PolicyAction =
  | 'search_products'
  | 'compare_products'
  | 'recommend_product'
  | 'suggest_upsell'
  | 'add_to_cart'
  | 'create_checkout'
  | 'initiate_payment'
  | 'execute_payment'
  | 'process_refund'
  | 'unknown_action';

export interface ActionPayload {
  action: PolicyAction | string;
  cart_id?: string;
  amount?: number;
  user_confirmed?: boolean;
  actor: 'AI_AGENT' | 'USER_APPROVER';
}

export class PolicyEngine {
  /**
   * Evaluates if an action by an AI agent or user passes safety guardrails.
   */
  public evaluate(payload: ActionPayload): PolicyEvaluation {
    const { action, amount = 0, user_confirmed = false, actor } = payload;
    const threshold = store.config.highValueThreshold;

    // RULE 1: Autonomous Refunds are strictly BLOCKED for AI agents
    if (action === 'process_refund') {
      store.recordEvent({
        event_type: 'BLOCKED_ACTION',
        description: 'Autonomous refund attempted by AI Buyer. Gated by Policy Rule POL-REFUND-01: AI cannot initiate financial clawbacks/refunds.',
        agent: 'Policy Engine',
        status: 'WARNING',
        metadata: { action, actor, reason: 'AI refund forbidden' }
      });

      return {
        action,
        allowed: false,
        requires_approval: true,
        reason: 'Autonomous refunds are prohibited for AI agents. Financial clawbacks must be authorized by human merchant operations.',
        risk_level: 'blocked',
        triggered_rule: 'POL-REFUND-01: REFUND_FORBIDDEN_FOR_AGENTS'
      };
    }

    // RULE 2: Read/Discovery actions are always autonomously allowed
    if (
      action === 'search_products' ||
      action === 'compare_products' ||
      action === 'recommend_product' ||
      action === 'suggest_upsell'
    ) {
      return {
        action,
        allowed: true,
        requires_approval: false,
        reason: 'Read and discovery actions operate safely within catalog boundaries.',
        risk_level: 'low',
        triggered_rule: 'POL-READ-01: AUTONOMOUS_DISCOVERY_ALLOWED'
      };
    }

    // RULE 3: Add to Cart and Checkout creation are allowed autonomously
    if (action === 'add_to_cart' || action === 'create_checkout') {
      return {
        action,
        allowed: true,
        requires_approval: false,
        reason: 'Staging items in cart or generating a draft checkout does not transfer funds.',
        risk_level: 'low',
        triggered_rule: 'POL-CART-01: COMMERCE_STAGING_ALLOWED'
      };
    }

    // RULE 4: Payment initiation / execution MUST require explicit user approval
    if (action === 'initiate_payment' || action === 'execute_payment') {
      const isHighValue = amount >= threshold;

      if (!user_confirmed) {
        store.recordEvent({
          event_type: 'PAYMENT_APPROVAL_REQUESTED',
          description: `Policy Engine intercepted payment request of ₹${amount.toLocaleString('en-IN')}. User explicit approval mandated before money movement.`,
          agent: 'Policy Engine',
          status: 'WARNING',
          metadata: { amount, threshold, is_high_value: isHighValue }
        });

        return {
          action,
          allowed: false,
          requires_approval: true,
          reason: isHighValue
            ? `Payment requires your approval because this action moves money (₹${amount.toLocaleString('en-IN')}) and exceeds the high-value threshold of ₹${threshold.toLocaleString('en-IN')}.`
            : `Payment requires your approval because this action moves money (₹${amount.toLocaleString('en-IN')}).`,
          risk_level: isHighValue ? 'high' : 'medium',
          threshold_amount: threshold,
          triggered_rule: isHighValue
            ? 'POL-PAY-02: HIGH_VALUE_TRANSACTION_GATE'
            : 'POL-PAY-01: MANDATORY_HUMAN_IN_THE_LOOP_PAYMENT'
        };
      }

      // User has explicitly confirmed/approved!
      store.recordEvent({
        event_type: 'PAYMENT_APPROVED',
        description: `User explicitly approved payment of ₹${amount.toLocaleString('en-IN')}. Proceeding to Razorpay checkout gateway.`,
        agent: 'User (Approver)',
        status: 'SUCCESS',
        metadata: { amount, authorized_by: 'USER_EXPLICIT_CONFIRMATION' }
      });

      return {
        action,
        allowed: true,
        requires_approval: false,
        reason: 'Explicit user authorization verified. Financial execution authorized.',
        risk_level: 'low',
        triggered_rule: 'POL-AUTH-01: USER_AUTHORIZED_EXECUTION'
      };
    }

    // RULE 5: Unknown or unrecognized actions are blocked by default
    store.recordEvent({
      event_type: 'BLOCKED_ACTION',
      description: `Unrecognized action '${action}' blocked by default zero-trust policy.`,
      agent: 'Policy Engine',
      status: 'ERROR',
      metadata: { action }
    });

    return {
      action,
      allowed: false,
      requires_approval: true,
      reason: `Action '${action}' is not on the verified commerce action list. Zero-trust security policy blocked execution.`,
      risk_level: 'blocked',
      triggered_rule: 'POL-SEC-01: ZERO_TRUST_BLOCK'
    };
  }
}

export const policyEngine = new PolicyEngine();

import { Resend } from 'resend';
import { config } from '../config';
import { render } from '@react-email/render';
import React from 'react';

/**
 * Mail Service
 * Handles sending transactional emails using Resend and React Email.
 */
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(config.RESEND_API_KEY || 're_123'); // Placeholder if key missing
  }

  /**
   * Send an email using a React template
   */
  async sendEmail(to: string, subject: string, template: React.ReactElement) {
    try {
      const html = await render(template);
      
      const { data, error } = await this.resend.emails.send({
        from: config.EMAIL_FROM || 'onboarding@resend.dev',
        to,
        subject,
        html,
      });

      if (error) {
        console.error('Resend Error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Mail Service Error:', err);
      return { success: false, error: err };
    }
  }

  /**
   * Pre-defined: Send Welcome Email
   */
  async sendWelcomeEmail(to: string, name: string) {
    // We will implement the actual template in the next step
    // For now, this is a placeholder for the service integration
    console.log(`Simulating Welcome Email to ${to} (${name})`);
  }
}

export const mailService = new MailService();

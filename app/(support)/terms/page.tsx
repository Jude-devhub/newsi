import React from "react";
import Link from "next/link";

export default function TermsOfUse() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Terms of Use</h1>
        <p className="text-sm">Last updated: October 12, 2025</p>
      </header>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to <strong>newsi</strong> ("we", "us", "our"). These Terms of Use
          (the "Terms") govern your access to and use of our website, services, and
          applications (collectively, the "Service"). By using or accessing the Service you
          agree to be bound by these Terms. If you do not agree, please do not use the Service.
        </p>
      </section>

      <section>
        <h2>2. Eligibility</h2>
        <p>
          You must be at least 13 years old (or the minimum age permitted in your jurisdiction)
          to use the Service. By using the Service you represent and warrant that you meet the
          eligibility requirements.
        </p>
      </section>

      <section>
        <h2>3. Account Registration</h2>
        <p>
          Some features require an account. You are responsible for maintaining the security of
          your account credentials and for all activity that occurs under your account. You must
          provide accurate and complete information and keep it up to date.
        </p>
      </section>

      <section>
        <h2>4. Acceptable Use</h2>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Violate any law, regulation, or third-party rights.</li>
          <li>Transmit harmful, abusive, defamatory or illegal content.</li>
          <li>Attempt to interfere with or disrupt the Service or servers.</li>
        </ul>
      </section>

      <section>
        <h2>5. Content</h2>
        <p>
          You retain ownership of content you post to the Service. By posting content you grant
          us a non-exclusive, worldwide, royalty-free license to use, display, and distribute
          that content when providing the Service.
        </p>
      </section>

      <section>
        <h2>6. Intellectual Property</h2>
        <p>
          All content provided by us (including text, designs, logos, software and other
          materials) is our property or licensed to us and is protected by copyright, trademark
          and other laws. You may not copy or use our intellectual property without prior
          written consent.
        </p>
      </section>

      <section>
        <h2>7. Payments & Refunds</h2>
        <p>
          If the Service offers paid features, payment terms and refund policies will be
          displayed at the point of purchase. Subscription cancellations typically take effect
          at the end of the current billing period unless otherwise specified.
        </p>
      </section>

      <section>
        <h2>8. Disclaimers</h2>
        <p>
          The Service is provided "as is" and "as available" without warranties of any kind.
          We disclaim all warranties, express or implied, including fitness for a particular
          purpose and non-infringement.
        </p>
      </section>

      <section>
        <h2>9. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, we will not be liable for indirect,
          incidental, special, consequential, or punitive damages arising from your use of the
          Service. Our total aggregate liability for any claim related to the Service will not
          exceed the amount you paid us in the 12 months prior to the claim.
        </p>
      </section>

      <section>
        <h2>10. Indemnification</h2>
        <p>
          You agree to indemnify and hold us harmless from any claims, losses, liabilities,
          damages, and expenses (including reasonable attorneys' fees) arising out of your use
          of the Service or violation of these Terms.
        </p>
      </section>

      <section>
        <h2>11. Termination</h2>
        <p>
          We may suspend or terminate your access to the Service at any time for violation of
          these Terms or for other business reasons. Upon termination, your rights to access
          the Service will end.
        </p>
      </section>

      <section>
        <h2>12. Governing Law</h2>
        <p>
          These Terms are governed by the laws of <strong>Nigeria</strong> without
          regard to conflict of laws rules. Any disputes arising hereunder will be resolved in
          the courts located in <strong>Nigeria</strong>.
        </p>
      </section>

      <section>
        <h2>13. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. If we make material changes we will
          provide notice (for example by email or a prominent notice on the Service). Your
          continued use after changes means you accept the new Terms.
        </p>
      </section>

      <section>
        <h2>14. Contact</h2>
        <p>If you have questions about these Terms, please contact us at:</p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:">judeokechukwuogbonna@gmail.com</a>
        </p>
      </section>

      <footer className="mt-8 text-sm">
        <p>Thank you for using <strong>Your Site Name</strong>.</p>
        <p className="mt-2">
          Please also read our{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}

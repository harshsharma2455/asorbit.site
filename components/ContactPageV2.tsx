// ContactPageV2.tsx
// ──────────────────────────────────────────────
// Thin wrapper that re-uses your existing ContactPage so the
// exact same UI can be reached through a different view key.

import React from 'react';
import ContactPage from './ContactPage';   // adjust path if needed

const ContactPageV2: React.FC = () => <ContactPage />;

export default ContactPageV2;

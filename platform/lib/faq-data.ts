/**
 * FAQ content shared between FAQ section UI and FAQPage JSON-LD.
 */
export const faqItems = [
  {
    question: 'Do you handle international shipping?',
    answer: 'Yes. We manage global fulfillment and delivery across multiple regions.',
  },
  {
    question: 'Can recipients choose their own address?',
    answer: 'Yes. Recipients securely enter their details themselves.',
  },
  {
    question: 'Is this suitable for large teams?',
    answer: 'Absolutely. The platform is built to scale from small teams to enterprises.',
  },
  {
    question: 'Can we customize gifts with our branding?',
    answer: 'Yes. Branding and custom kits are fully supported.',
  },
] as const

export function getFAQPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

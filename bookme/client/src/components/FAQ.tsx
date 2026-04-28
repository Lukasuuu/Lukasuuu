import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/**
 * FAQ Section Component
 * Design: Expandable accordion with gradient accents
 * - 6 common questions
 * - Smooth expand/collapse animations
 * - Responsive layout
 */
export default function FAQ() {
  const faqs = [
    {
      question: "Como posso começar com BookMe?",
      answer: "É muito simples! Basta registar-se gratuitamente no nosso site, configurar os seus serviços e horários, e partilhar a sua página de booking com os clientes. Pode começar a receber marcações em minutos.",
    },
    {
      question: "Preciso de cartão de crédito para começar?",
      answer: "Não! BookMe oferece um período de teste gratuito de 14 dias sem necessidade de cartão de crédito. Pode explorar todas as funcionalidades do plano Grátis sem qualquer compromisso.",
    },
    {
      question: "Posso mudar de plano a qualquer momento?",
      answer: "Sim, claro! Pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações entram em vigor imediatamente e os valores são ajustados proporcionalmente.",
    },
    {
      question: "Como funcionam as notificações por WhatsApp?",
      answer: "BookMe envia automaticamente lembretes aos seus clientes por WhatsApp antes das marcações. Isto reduz significativamente o número de faltas (no-shows) e melhora a experiência do cliente.",
    },
    {
      question: "Posso integrar BookMe com outras ferramentas?",
      answer: "Sim! BookMe oferece uma API robusta que permite integrar com qualquer ferramenta que utilize. Além disso, temos integrações prontas com Google Calendar, Stripe e outras plataformas populares.",
    },
    {
      question: "Qual é o suporte disponível?",
      answer: "Oferecemos suporte por email para todos os planos. Os clientes do plano Business têm acesso a suporte prioritário por telefone e chat. Também temos uma base de conhecimento completa e tutoriais em vídeo.",
    },
  ];

  return (
    <section id="faq" className="relative py-20 md:py-32 overflow-hidden">
      <div className="container max-w-3xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Perguntas Frequentes
            </span>
          </h2>
          <p className="text-foreground/70 text-lg">
            Respostas às dúvidas mais comuns sobre BookMe.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-colors"
            >
              <AccordionTrigger className="text-left text-white font-semibold hover:text-blue-400 transition-colors py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 leading-relaxed pt-2 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Additional Help */}
        <div className="mt-16 p-8 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Ainda tem dúvidas?
          </h3>
          <p className="text-foreground/80 mb-4">
            A nossa equipa de suporte está sempre disponível para ajudar.
          </p>
          <button className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors">
            Contacte-nos
          </button>
        </div>
      </div>
    </section>
  );
}

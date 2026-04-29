import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  const lastUpdate = 'Abril de 2026';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Política de Privacidade</h1>
          <p className="text-foreground/60 mb-10 text-sm">Última atualização: {lastUpdate}</p>

          <div className="space-y-8 text-foreground/80 leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Identidade do Responsável pelo Tratamento</h2>
              <p>O responsável pelo tratamento dos dados pessoais recolhidos através da plataforma BookMe é:</p>
              <div className="bg-card border border-border rounded-lg p-4 mt-3 space-y-1 text-sm">
                <p><strong className="text-foreground/90">Designação:</strong> [NOME_EMPRESA]</p>
                <p><strong className="text-foreground/90">NIF:</strong> [NIF]</p>
                <p><strong className="text-foreground/90">Morada:</strong> [MORADA_FISCAL]</p>
                <p><strong className="text-foreground/90">Email:</strong> <a href="mailto:[EMAIL_CONTACTO]" className="text-blue-400 hover:text-blue-300">[EMAIL_CONTACTO]</a></p>
                <p><strong className="text-foreground/90">Telefone:</strong> [TELEFONE]</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Encarregado de Proteção de Dados (DPO)</h2>
              <p>
                Para exercer os seus direitos ou colocar questões sobre o tratamento dos seus dados pessoais, pode contactar o nosso Encarregado de Proteção de Dados através do email:{' '}
                <a href="mailto:[EMAIL_DPO]" className="text-blue-400 hover:text-blue-300">[EMAIL_DPO]</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Dados Pessoais Recolhidos</h2>
              <p>Recolhemos e tratamos as seguintes categorias de dados pessoais:</p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                <li><strong>Dados de identificação:</strong> nome completo, endereço de email, número de telefone</li>
                <li><strong>Dados do negócio:</strong> nome do negócio, morada, horário de funcionamento, logótipo</li>
                <li><strong>Dados de utilização:</strong> marcações, serviços, histórico de clientes, preferências de notificação</li>
                <li><strong>Dados de pagamento:</strong> processados diretamente pelo Stripe; não armazenamos dados de cartão de crédito</li>
                <li><strong>Dados de navegação:</strong> endereço IP, tipo de browser, sistema operativo, páginas visitadas, cookies</li>
                <li><strong>Dados de comunicação:</strong> mensagens enviadas através do formulário de contacto</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Finalidades e Base Legal do Tratamento</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-3">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 text-foreground/90 font-semibold">Finalidade</th>
                      <th className="text-left py-2 text-foreground/90 font-semibold">Base Legal (RGPD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Prestação do serviço (marcações, notificações)', 'Art. 6.º(1)(b) — Execução de contrato'],
                      ['Gestão de conta e autenticação', 'Art. 6.º(1)(b) — Execução de contrato'],
                      ['Processamento de pagamentos via Stripe', 'Art. 6.º(1)(b) — Execução de contrato'],
                      ['Emissão de faturas e cumprimento fiscal', 'Art. 6.º(1)(c) — Obrigação legal'],
                      ['Comunicações de marketing (com consentimento)', 'Art. 6.º(1)(a) — Consentimento'],
                      ['Melhoria do serviço e analytics', 'Art. 6.º(1)(f) — Interesse legítimo'],
                      ['Prevenção de fraude e segurança', 'Art. 6.º(1)(f) — Interesse legítimo'],
                    ].map(([fin, base], i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 pr-4 text-foreground/80">{fin}</td>
                        <td className="py-2 text-foreground/60 text-xs">{base}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Destinatários e Sub-processadores</h2>
              <p>Os seus dados podem ser partilhados com os seguintes prestadores de serviços:</p>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 text-foreground/90 font-semibold">Prestador</th>
                      <th className="text-left py-2 pr-4 text-foreground/90 font-semibold">Finalidade</th>
                      <th className="text-left py-2 text-foreground/90 font-semibold">Localização</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Supabase', 'Base de dados e autenticação', 'UE (Alemanha)'],
                      ['Stripe', 'Processamento de pagamentos', 'EUA (Data Privacy Framework UE-EUA)'],
                      ['Resend', 'Envio de emails transacionais', 'EUA (Cláusulas Contratuais Tipo)'],
                      ['Twilio', 'Mensagens WhatsApp', 'EUA (Cláusulas Contratuais Tipo)'],
                      ['Vercel', 'Hosting da aplicação', 'Global (Cláusulas Contratuais Tipo)'],
                      ['Google Analytics', 'Analytics de utilização (só com consentimento)', 'EUA (Data Privacy Framework UE-EUA)'],
                    ].map(([p, f, l], i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 pr-4 text-foreground/90 font-medium">{p}</td>
                        <td className="py-2 pr-4 text-foreground/70">{f}</td>
                        <td className="py-2 text-foreground/60 text-xs">{l}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Transferências Internacionais de Dados</h2>
              <p>
                Quando transferimos dados pessoais para países terceiros, garantimos um nível adequado de proteção através de
                decisões de adequação da Comissão Europeia (Data Privacy Framework UE-EUA) e de cláusulas contratuais tipo
                aprovadas pela Comissão Europeia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Período de Retenção dos Dados</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-3">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 text-foreground/90 font-semibold">Categoria</th>
                      <th className="text-left py-2 text-foreground/90 font-semibold">Período</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Dados de conta', 'Enquanto a conta estiver ativa + 30 dias após cancelamento'],
                      ['Dados de marcações', '5 anos (obrigação fiscal)'],
                      ['Dados de faturação', '10 anos (obrigação fiscal portuguesa — art. 52.º CIRS)'],
                      ['Cookies de sessão', 'Duração da sessão'],
                      ['Cookies analíticos/marketing', 'Até 13 meses'],
                      ['Registos de sistema', '90 dias'],
                    ].map(([cat, per], i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 pr-4 text-foreground/80">{cat}</td>
                        <td className="py-2 text-foreground/60">{per}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Direitos dos Titulares dos Dados</h2>
              <p>Nos termos do RGPD e da Lei n.º 58/2019, tem os seguintes direitos:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {[
                  ['Acesso (Art. 15.º)', 'Obter confirmação e aceder a uma cópia dos seus dados'],
                  ['Retificação (Art. 16.º)', 'Corrigir dados inexatos ou incompletos'],
                  ['Apagamento (Art. 17.º)', '"Direito ao esquecimento" — eliminar os seus dados'],
                  ['Limitação (Art. 18.º)', 'Restringir o tratamento em determinadas circunstâncias'],
                  ['Portabilidade (Art. 20.º)', 'Receber dados em formato estruturado e legível por máquina'],
                  ['Oposição (Art. 21.º)', 'Opor-se ao tratamento baseado em interesse legítimo'],
                  ['Não sujeição a decisões automatizadas (Art. 22.º)', 'Direito de não ser sujeito a decisões exclusivamente automatizadas'],
                  ['Retirar consentimento', 'Retirar o consentimento dado a qualquer momento'],
                ].map(([title, desc], i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-3">
                    <p className="font-semibold text-foreground/90 text-sm mb-1">{title}</p>
                    <p className="text-foreground/60 text-xs">{desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm">
                Para exercer os seus direitos, envie um email para{' '}
                <a href="mailto:[EMAIL_DPO]" className="text-blue-400 hover:text-blue-300">[EMAIL_DPO]</a>{' '}
                com identificação e descrição do pedido. Respondemos no prazo máximo de 30 dias.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Direito de Reclamação à CNPD</h2>
              <p>
                Se considerar que o tratamento dos seus dados viola o RGPD, tem o direito de apresentar
                reclamação junto da Comissão Nacional de Proteção de Dados:
              </p>
              <div className="bg-card border border-border rounded-lg p-4 mt-3 text-sm space-y-1">
                <p className="font-semibold text-foreground/90">Comissão Nacional de Proteção de Dados (CNPD)</p>
                <p className="text-foreground/70">Rua de São Bento, 148-3.º, 1200-821 Lisboa</p>
                <p className="text-foreground/70">
                  Website:{' '}
                  <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    www.cnpd.pt
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Política de Cookies</h2>
              <p>Utilizamos os seguintes tipos de cookies:</p>
              <div className="space-y-3 mt-3">
                {[
                  {
                    title: 'Cookies Essenciais (sempre ativos)',
                    items: ['Sessão de autenticação', 'Preferências do utilizador', 'Segurança (proteção CSRF)'],
                    cls: 'border-green-500/30 bg-green-500/5',
                  },
                  {
                    title: 'Cookies Analíticos (apenas com consentimento)',
                    items: ['Google Analytics — an��lise de tráfego e comportamento dos visitantes'],
                    cls: 'border-blue-500/30 bg-blue-500/5',
                  },
                  {
                    title: 'Cookies de Marketing (apenas com consentimento)',
                    items: ['Facebook Pixel — medição de conversões e publicidade personalizada'],
                    cls: 'border-purple-500/30 bg-purple-500/5',
                  },
                ].map((c, i) => (
                  <div key={i} className={`border rounded-lg p-4 ${c.cls}`}>
                    <p className="font-semibold text-foreground/90 text-sm mb-2">{c.title}</p>
                    <ul className="list-disc list-inside text-foreground/60 text-xs space-y-1">
                      {c.items.map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm">
                Pode gerir as suas preferências de cookies a qualquer momento clicando em "Gerir Cookies" no rodapé do site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Alterações a Esta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Para alterações materiais, notificamos
                por email com pelo menos 30 dias de antecedência. A data da última atualização está indicada no topo desta página.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

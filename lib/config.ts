// Dados de contato
const whatsappNumber = '5547996524168';
const phoneDisplay = '(47) 99652-4168';
const email = 'ezermec@gmail.com';

const WA = whatsappNumber.replace(/\D/g, '');

export const site = {
  whatsappNumber: WA,
  phoneDisplay,
  email,
  waHref:
    'https://wa.me/' +
    WA +
    '?text=' +
    encodeURIComponent('Olá! Gostaria de mais informações sobre os produtos da Ezermec.'),
  mailGeneral: 'mailto:' + email + '?subject=' + encodeURIComponent('Contato - Ezermec'),
  telHref: 'tel:+55' + phoneDisplay.replace(/\D/g, ''),
};

/** Link de WhatsApp para orçamento de um produto específico. */
export function productWaHref(name: string, code: string): string {
  const text = encodeURIComponent(
    'Olá! Gostaria de solicitar um orçamento do produto: ' + name + ' (Cód. ' + code + '). Poderiam me ajudar?',
  );
  return 'https://wa.me/' + WA + '?text=' + text;
}

/** Link de e-mail para orçamento de um produto específico. */
export function productMailHref(name: string, code: string, fab: string, brand: string): string {
  const body = encodeURIComponent(
    'Olá,\n\nGostaria de solicitar um orçamento para o produto:\n\nProduto: ' +
      name +
      '\nCódigo interno: ' +
      code +
      '\nCódigo do fabricante: ' +
      fab +
      '\nMarca: ' +
      brand +
      '\n\nObrigado!',
  );
  return (
    'mailto:' + email + '?subject=' + encodeURIComponent('Orçamento - ' + name) + '&body=' + body
  );
}

// Supabase (chave publicável é segura no frontend; fallback embutido para
// funcionar mesmo sem .env configurado — o acesso é restrito por RLS).
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://qawzvbgxlyohppereybe.supabase.co',
  publishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    'sb_publishable_T5ewD1mX8a_PlvU6cJo7vw_s7qkCzGE',
};

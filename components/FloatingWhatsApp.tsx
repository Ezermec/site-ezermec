import { site } from '@/lib/config';

export function FloatingWhatsApp() {
  return (
    <a
      href={site.waHref}
      target="_blank"
      rel="noopener"
      title="Fale conosco no WhatsApp"
      className="ez-lift"
      style={{
        position: 'fixed', right: 22, bottom: 22, zIndex: 70, width: 60, height: 60,
        borderRadius: '50%', background: 'var(--green)', color: '#fff', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: 32,
        boxShadow: '0 12px 30px -6px rgba(37,211,102,.6)', animation: 'ezpulse 2.4s infinite',
      }}
    >
      <i className="ph-fill ph-whatsapp-logo" />
    </a>
  );
}

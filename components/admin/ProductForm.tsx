'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { upsertProduct, deleteProduct } from '@/app/painel/actions';

const label = { display: 'block', fontWeight: 700, fontSize: 13, color: 'var(--navy)', marginBottom: 6 };
const input = { width: '100%', border: '1px solid var(--border)', borderRadius: 9, padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', color: 'var(--navy)', background: '#fff' };
const field = { marginBottom: 16 };

function Field({ children, htmlFor, title }: { children: React.ReactNode; htmlFor: string; title: string }) {
  return (
    <div style={field}>
      <label htmlFor={htmlFor} style={label}>{title}</label>
      {children}
    </div>
  );
}

export function ProductForm({ product, error }: { product?: Product; error?: string }) {
  const isNew = !product;
  const [featured, setFeatured] = useState(!!product?.featured);

  return (
    <>
    <form id="product-form" action={upsertProduct}>
      <input type="hidden" name="originalSlug" value={product?.slug ?? ''} />

      {error && (
        <div style={{ background: '#fbe9e7', color: '#c0392b', border: '1px solid #f5c6c0', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 0 }}>
        <Field htmlFor="name" title="Nome do produto *">
          <input id="name" name="name" required defaultValue={product?.name} style={input} />
        </Field>
        <Field htmlFor="slug" title="Slug (URL) — deixe em branco para gerar do nome">
          <input id="slug" name="slug" defaultValue={product?.slug} placeholder="ex: rolamento-6205-2z" style={input} />
        </Field>
        <Field htmlFor="code" title="Código interno *">
          <input id="code" name="code" required defaultValue={product?.code} style={input} />
        </Field>
        <Field htmlFor="fab" title="Código do fabricante">
          <input id="fab" name="fab" defaultValue={product?.fab} style={input} />
        </Field>
        <Field htmlFor="brand" title="Marca *">
          <input id="brand" name="brand" required defaultValue={product?.brand} style={input} />
        </Field>
        <Field htmlFor="cat" title="Categoria *">
          <input id="cat" name="cat" required defaultValue={product?.cat} style={input} />
        </Field>
        <Field htmlFor="supplier" title="Fornecedor">
          <input id="supplier" name="supplier" defaultValue={product?.supplier} style={input} />
        </Field>
        <Field htmlFor="icon" title="Ícone (Phosphor, ex: ph-gear)">
          <input id="icon" name="icon" defaultValue={product?.icon || 'ph-package'} style={input} />
        </Field>
        <Field htmlFor="weight" title="Peso">
          <input id="weight" name="weight" defaultValue={product?.weight} style={input} />
        </Field>
        <Field htmlFor="dims" title="Dimensões">
          <input id="dims" name="dims" defaultValue={product?.dims} style={input} />
        </Field>
        <Field htmlFor="material" title="Material">
          <input id="material" name="material" defaultValue={product?.material} style={input} />
        </Field>
        <Field htmlFor="position" title="Posição no catálogo (ordem)">
          <input id="position" name="position" type="number" defaultValue={product?.position ?? ''} style={input} />
        </Field>
      </div>

      <Field htmlFor="short" title="Descrição curta (cards)">
        <input id="short" name="short" defaultValue={product?.short} style={input} />
      </Field>
      <Field htmlFor="full_description" title="Descrição completa (página do produto)">
        <textarea id="full_description" name="full_description" defaultValue={product?.full} rows={4} style={{ ...input, resize: 'vertical' as const }} />
      </Field>
      <Field htmlFor="tags" title="Tags (separadas por vírgula)">
        <input id="tags" name="tags" defaultValue={product?.tags?.join(', ')} style={input} />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 0, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 18px 4px', marginTop: 8, marginBottom: 20 }}>
        <Field htmlFor="stock_quantity" title="Quantidade em estoque *">
          <input id="stock_quantity" name="stock_quantity" type="number" min={0} required defaultValue={product?.stockQty ?? 0} style={input} />
        </Field>
        <Field htmlFor="low_stock_threshold" title="Limite para “estoque baixo”">
          <input id="low_stock_threshold" name="low_stock_threshold" type="number" min={0} defaultValue={product?.lowStockThreshold ?? 5} style={input} />
        </Field>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 0, cursor: 'pointer' }}>
        <input type="checkbox" name="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} style={{ width: 18, height: 18 }} />
        Exibir em destaque na home
      </label>
    </form>

    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: 26 }}>
      <button type="submit" form="product-form" className="ez-lift" style={{ background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
        {isNew ? 'Criar produto' : 'Salvar alterações'}
      </button>
      {!isNew && (
        <form action={deleteProduct} onSubmit={(e) => { if (!confirm(`Remover "${product?.name}"? Esta ação não pode ser desfeita.`)) e.preventDefault(); }}>
          <input type="hidden" name="slug" value={product?.slug} />
          <button type="submit" style={{ background: 'none', border: '1.5px solid #f5c6c0', color: '#c0392b', borderRadius: 10, padding: '12px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Excluir produto
          </button>
        </form>
      )}
    </div>
    </>
  );
}

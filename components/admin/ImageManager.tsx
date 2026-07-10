'use client';

import { useMemo, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PRODUCT_IMAGES_BUCKET, productImageUrl } from '@/lib/storage';

function extOf(name: string): string {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : 'jpg';
}

export function ImageManager({ initialImages }: { initialImages: string[] }) {
  const supabase = useMemo(() => createClient(), []);
  const [images, setImages] = useState<string[]>(initialImages);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setError(null);
    const added: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Selecione apenas arquivos de imagem.');
        continue;
      }
      const path = `products/${crypto.randomUUID()}.${extOf(file.name)}`;
      const { error: upErr } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (upErr) {
        setError('Falha ao enviar imagem: ' + upErr.message);
        continue;
      }
      added.push(path);
    }
    if (added.length) setImages((prev) => [...prev, ...added]);
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function remove(path: string) {
    setImages((prev) => prev.filter((p) => p !== path));
    // remove do Storage (best-effort)
    await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([path]).catch(() => {});
  }

  function makeMain(path: string) {
    setImages((prev) => [path, ...prev.filter((p) => p !== path)]);
  }

  return (
    <div>
      {/* Campos ocultos enviados no submit (a ordem define qual é a principal) */}
      {images.map((path) => (
        <input key={path} type="hidden" name="images" value={path} />
      ))}

      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 12, marginBottom: 14 }}>
          {images.map((path, i) => (
            <div key={path} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', background: '#fff' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={productImageUrl(path)} alt="" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
              {i === 0 && (
                <span style={{ position: 'absolute', top: 6, left: 6, background: 'var(--navy)', color: '#fff', fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 100 }}>Principal</span>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', gap: 1 }}>
                {i !== 0 && (
                  <button type="button" onClick={() => makeMain(path)} style={{ flex: 1, border: 'none', background: 'rgba(5,40,87,.82)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '6px 4px', cursor: 'pointer' }}>Tornar principal</button>
                )}
                <button type="button" onClick={() => remove(path)} title="Remover" style={{ border: 'none', background: 'rgba(192,57,43,.9)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '6px 10px', cursor: 'pointer' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="ez-lift" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: 'var(--navy)', border: '1.5px dashed var(--border2)', borderRadius: 10, padding: '11px 18px', fontWeight: 700, fontSize: 14, cursor: busy ? 'wait' : 'pointer' }}>
        <i className="ph ph-upload-simple" style={{ fontSize: 18 }} />
        {busy ? 'Enviando…' : 'Adicionar imagens'}
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} disabled={busy} style={{ display: 'none' }} />
      </label>
      <span style={{ fontSize: 12.5, color: 'var(--muted)', marginLeft: 12 }}>A primeira imagem é a principal (usada nos cards).</span>

      {error && <div style={{ color: '#c0392b', fontSize: 13, marginTop: 10 }}>{error}</div>}
    </div>
  );
}

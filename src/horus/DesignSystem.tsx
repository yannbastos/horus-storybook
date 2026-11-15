import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Button, StatusMessage, Tag } from './Horus';
import type { OperationalState, TagTone } from './Horus';

export interface FormFieldProps {
  id?: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  as?: 'input' | 'textarea' | 'select';
  type?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  onChange?: (value: string) => void;
}

export function FormField({
  id,
  label,
  help,
  error,
  required = false,
  disabled = false,
  as = 'input',
  type = 'text',
  value,
  defaultValue,
  placeholder,
  options = [],
  onChange,
}: FormFieldProps) {
  const autoId = useId();
  const fieldId = id ?? `field-${autoId}`;
  const helpId = help ? `${fieldId}-help` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="field">
      <label className="field-label" htmlFor={fieldId}>
        {label}
        {required ? ' *' : ''}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={fieldId}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={e => onChange?.(e.target.value)}
        />
      ) : as === 'select' ? (
        <select
          id={fieldId}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={e => onChange?.(e.target.value)}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={e => onChange?.(e.target.value)}
        />
      )}
      {help ? (
        <p id={helpId} className="field-help">
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export interface PanelCardProps {
  eyebrow: string;
  title: string;
  state?: OperationalState;
  badge?: { label: string; tone?: TagTone };
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
}

export function PanelCard({
  eyebrow,
  title,
  state = 'success',
  badge,
  description,
  children,
  actions,
}: PanelCardProps) {
  return (
    <section className="card" aria-label={title}>
      <div className="row spread">
        <div>
          <p className="eyebrow muted">{eyebrow}</p>
          <h3>{title}</h3>
        </div>
        {badge ? <Tag tone={badge.tone ?? 'neutral'}>{badge.label}</Tag> : null}
      </div>

      {state === 'loading' ? (
        <StatusMessage state="loading">Carregando dados do painel…</StatusMessage>
      ) : state === 'error' ? (
        <StatusMessage state="error">
          Falha ao carregar o painel. Verifique o backend local e tente novamente.
        </StatusMessage>
      ) : state === 'empty' ? (
        <StatusMessage state="empty">
          Nenhum item disponível neste painel no momento.
        </StatusMessage>
      ) : (
        <>
          {description ? <p className="muted">{description}</p> : null}
          {children}
        </>
      )}

      {actions ? <div className="actions">{actions}</div> : null}
    </section>
  );
}

export interface OperationalListItem {
  id: string;
  title: string;
  meta: string;
  statusLabel: string;
  tone?: TagTone;
}

export interface OperationalListProps {
  ariaLabel: string;
  state?: OperationalState;
  items?: OperationalListItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export function OperationalList({
  ariaLabel,
  state = 'success',
  items = [],
  selectedId,
  onSelect,
}: OperationalListProps) {
  const [internalSelected, setInternalSelected] = useState(selectedId ?? items[0]?.id ?? '');
  const activeId = selectedId ?? internalSelected;

  if (state === 'loading') {
    return <StatusMessage state="loading">Carregando lista de itens…</StatusMessage>;
  }
  if (state === 'error') {
    return <StatusMessage state="error">Não foi possível carregar a lista.</StatusMessage>;
  }
  if (state === 'empty' || items.length === 0) {
    return <StatusMessage state="empty">Nenhum registro encontrado na lista.</StatusMessage>;
  }

  return (
    <ul className="list-group" aria-label={ariaLabel}>
      {items.map(item => {
        const isSelected = item.id === activeId;
        return (
          <li
            key={item.id}
            className={`list-item${isSelected ? ' selected' : ''}`}
          >
            <div className="list-item-content">
              <span className="list-item-title">{item.title}</span>
              <span className="list-item-meta">{item.meta}</span>
            </div>
            <div className="row">
              <Tag tone={item.tone ?? 'neutral'}>{item.statusLabel}</Tag>
              {onSelect ? (
                <Button
                  size="sm"
                  active={isSelected}
                  onClick={() => {
                    setInternalSelected(item.id);
                    onSelect(item.id);
                  }}
                >
                  {isSelected ? 'Selecionado' : 'Selecionar'}
                </Button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  ariaLabel: string;
  items: TabItem[];
  initialTabId?: string;
}

export function Tabs({ ariaLabel, items, initialTabId }: TabsProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(initialTabId ?? items[0]?.id ?? '');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % items.length;
    else if (e.key === 'ArrowLeft') nextIndex = (index - 1 + items.length) % items.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = items.length - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      const target = items[nextIndex];
      if (target) {
        setActiveId(target.id);
        tabRefs.current[nextIndex]?.focus();
      }
    }
  };

  const activeItem = items.find(i => i.id === activeId) ?? items[0];

  return (
    <div>
      <div className="tabs" role="tablist" aria-label={ariaLabel}>
        {items.map((item, idx) => {
          const isSelected = item.id === activeItem?.id;
          return (
            <button
              key={item.id}
              ref={el => {
                tabRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={isSelected ? 0 : -1}
              className="tab"
              onClick={() => setActiveId(item.id)}
              onKeyDown={e => handleKeyDown(e, idx)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activeItem ? (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeItem.id}`}
          aria-labelledby={`${baseId}-tab-${activeItem.id}`}
          className="tab-panel"
        >
          {activeItem.content}
        </div>
      ) : null}
    </div>
  );
}

export interface DialogProps {
  open: boolean;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  cancelLabel?: string;
  inlinePreview?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}

export function Dialog({
  open,
  eyebrow = 'CONFIRMAÇÃO',
  title,
  description,
  children,
  confirmLabel = 'Confirmar',
  confirmVariant = 'primary',
  cancelLabel = 'Cancelar',
  inlinePreview = false,
  onConfirm,
  onClose,
}: DialogProps) {
  const titleId = useId();
  const descId = useId();

  if (!open) return null;

  return (
    <div
      className={`dialog-backdrop${inlinePreview ? ' inline-preview' : ''}`}
      onKeyDown={e => {
        if (e.key === 'Escape') onClose?.();
      }}
    >
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
      >
        <div className="dialog-header">
          <div>
            <p className="eyebrow muted">{eyebrow}</p>
            <h3 id={titleId}>{title}</h3>
          </div>
          <Button size="sm" aria-label="Fechar diálogo" onClick={onClose}>
            FECHAR
          </Button>
        </div>

        <div className="dialog-body">
          {description ? (
            <p id={descId} className="muted">
              {description}
            </p>
          ) : null}
          {children}
        </div>

        <div className="dialog-actions">
          <Button onClick={onClose}>{cancelLabel}</Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export interface StatusBadgeProps {
  label: string;
  tone?: TagTone;
  dotState?: 'good' | 'warn' | 'bad';
  badgeState?: 'active' | 'blocked' | 'unverified' | 'unavailable';
}

export function StatusBadge({
  label,
  tone = 'neutral',
  dotState,
  badgeState,
}: StatusBadgeProps) {
  const cls = tone === 'neutral' ? 'tag' : `tag ${tone}`;
  return (
    <span
      className={`${cls}${badgeState ? ' status-badge' : ''}`}
      data-state={badgeState}
    >
      {dotState ? (
        <span
          className={`status-dot${dotState === 'warn' ? '' : ` ${dotState}`}`}
          aria-hidden="true"
        />
      ) : null}
      {label}
    </span>
  );
}

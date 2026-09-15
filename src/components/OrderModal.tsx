import { useEffect, useState, type FormEvent } from 'react'
import { useApp } from '../app/AppContext'
import {
  CONTACT,
  DENSITY_OPTIONS,
  PRODUCTS,
  THICKNESS_OPTIONS,
  formatPrice,
  getProduct,
  priceForDensity,
  type ProductCategoryId,
} from '../data/products'
import { submitOrder } from '../lib/submitOrder'
import Modal from './Modal'
import { IconCheck, IconPhone } from './icons'
import './OrderModal.css'

interface Errors {
  name?: string
  phone?: string
  quantity?: string
}

export default function OrderModal() {
  const { orderOpen, closeOrder, orderPrefill, t, lang, densityLabel, thicknessLabel } = useApp()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [productId, setProductId] = useState<ProductCategoryId>(orderPrefill.productId)
  const [density, setDensity] = useState(orderPrefill.density)
  const [thickness, setThickness] = useState(orderPrefill.thickness)
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  // Tanlangan mahsulot/zichlik/qalinlik formaga avtomatik o'tadi
  useEffect(() => {
    if (!orderOpen) return
    setProductId(orderPrefill.productId)
    setDensity(orderPrefill.density)
    setThickness(orderPrefill.thickness)
    setDone(false)
    setErrors({})
    setSending(false)
  }, [orderOpen, orderPrefill])

  const price = priceForDensity(density)
  const product = getProduct(productId)

  const validate = (): Errors => {
    const e: Errors = {}
    if (name.trim().length < 2) e.name = t('order.errName')
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 9) e.phone = t('order.errPhone')
    if (!quantity.trim()) e.quantity = t('order.errQty')
    return e
  }

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const firstKey = Object.keys(e)[0]
      document.getElementById(`order-${firstKey}`)?.focus()
      return
    }

    setSending(true)
    await submitOrder({
      name: name.trim(),
      phone: phone.trim(),
      productId,
      productName: t(product.nameKey),
      density,
      thickness,
      quantity: quantity.trim(),
      note: note.trim(),
      createdAt: new Date().toISOString(),
      lang,
    })
    setSending(false)
    setDone(true)
  }

  const resetForm = () => {
    setName('')
    setPhone('')
    setQuantity('')
    setNote('')
    setErrors({})
    setDone(false)
  }

  return (
    <Modal
      open={orderOpen}
      onClose={closeOrder}
      label={t('order.title')}
      size="md"
      closeLabel={t('btn.close')}
    >
      {done ? (
        <div className="ordr ordr--done">
          <div className="ordr__tick" aria-hidden="true">
            <IconCheck size={30} />
          </div>
          <h3 className="ordr__donetitle">{t('order.success')}</h3>
          <p className="ordr__donenote">{t('order.successNote')}</p>

          <div className="ordr__summary">
            <div>
              <span>{t('order.product')}</span>
              <b>{t(product.nameKey)}</b>
            </div>
            <div>
              <span>{t('label.density')}</span>
              <b>{densityLabel(density)}</b>
            </div>
            <div>
              <span>{t('label.thickness')}</span>
              <b>{thicknessLabel(thickness)}</b>
            </div>
            <div>
              <span>{t('label.quantity')}</span>
              <b>{quantity}</b>
            </div>
          </div>

          <div className="ordr__doneacts">
            <a href={CONTACT.phoneHref} className="btn btn--primary btn--block">
              <IconPhone size={16} />
              {t('btn.call')}
            </a>
            <button type="button" className="btn btn--ghost btn--block" onClick={resetForm}>
              {t('order.new')}
            </button>
          </div>
        </div>
      ) : (
        <form className="ordr" onSubmit={onSubmit} noValidate>
          <header className="ordr__head">
            <span className="badge">{t('brand.sub')}</span>
            <h3 className="ordr__title">{t('order.title')}</h3>
            <p className="ordr__desc">{t('order.desc')}</p>
          </header>

          <div className="ordr__grid">
            <div className="field">
              <label className="field-label" htmlFor="order-name">
                {t('order.name')} *
              </label>
              <input
                id="order-name"
                className="input"
                data-autofocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('order.namePh')}
                aria-invalid={!!errors.name}
                autoComplete="name"
              />
              {errors.name && <span className="err">{errors.name}</span>}
            </div>

            <div className="field">
              <label className="field-label" htmlFor="order-phone">
                {t('order.phone')} *
              </label>
              <input
                id="order-phone"
                className="input"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('order.phonePh')}
                aria-invalid={!!errors.phone}
                autoComplete="tel"
              />
              {errors.phone && <span className="err">{errors.phone}</span>}
            </div>

            <div className="field ordr__full">
              <label className="field-label" htmlFor="order-product">
                {t('order.product')}
              </label>
              <div className="select-wrap">
                <select
                  id="order-product"
                  className="select"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value as ProductCategoryId)}
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t(p.nameKey)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="order-density">
                {t('order.density')}
              </label>
              <div className="select-wrap">
                <select
                  id="order-density"
                  className="select"
                  value={density}
                  onChange={(e) => setDensity(Number(e.target.value))}
                >
                  {DENSITY_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {densityLabel(d)} — {formatPrice(priceForDensity(d))}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="order-thickness">
                {t('order.thickness')}
              </label>
              <div className="select-wrap">
                <select
                  id="order-thickness"
                  className="select"
                  value={thickness}
                  onChange={(e) => setThickness(Number(e.target.value))}
                >
                  {THICKNESS_OPTIONS.map((th) => (
                    <option key={th} value={th}>
                      {thicknessLabel(th)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field ordr__full">
              <label className="field-label" htmlFor="order-quantity">
                {t('order.qty')} *
              </label>
              <input
                id="order-quantity"
                className="input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={t('order.qtyPh')}
                aria-invalid={!!errors.quantity}
              />
              {errors.quantity && <span className="err">{errors.quantity}</span>}
            </div>

            <div className="field ordr__full">
              <label className="field-label" htmlFor="order-note">
                {t('order.note')}
              </label>
              <textarea
                id="order-note"
                className="textarea"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('order.notePh')}
                rows={3}
              />
            </div>
          </div>

          <div className="ordr__price glass">
            <div>
              <span className="ordr__pricelabel">{t('order.estimate')}</span>
              <span className="ordr__pricemeta">
                {densityLabel(density)} · {thicknessLabel(thickness)}
              </span>
            </div>
            <span className="ordr__priceval">{formatPrice(price)}</span>
          </div>

          <div className="ordr__actions">
            <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={sending}>
              {sending ? t('order.sending') : t('order.submit')}
            </button>
            <a href={CONTACT.phoneHref} className="btn btn--glass btn--lg ordr__call">
              <IconPhone size={16} />
              <span className="ordr__callnum">{CONTACT.phone}</span>
            </a>
          </div>
        </form>
      )}
    </Modal>
  )
}

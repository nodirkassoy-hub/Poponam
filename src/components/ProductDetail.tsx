import { useEffect, useState } from 'react'
import { useApp } from '../app/AppContext'
import {
  SHEET_SIZE_LABEL,
  formatPrice,
  getProduct,
  priceForDensity,
} from '../data/products'
import FoamViewer from './FoamViewer'
import Modal from './Modal'
import { IconCheck, IconPhone } from './icons'
import { CONTACT } from '../data/products'
import './ProductDetail.css'

export default function ProductDetail() {
  const {
    detailId,
    detailPrefill,
    closeDetail,
    openOrder,
    t,
    densityLabel,
    thicknessLabel,
  } = useApp()

  const [density, setDensity] = useState(detailPrefill.density)
  const [thickness, setThickness] = useState(detailPrefill.thickness)
  const [tab, setTab] = useState<'photo' | '3d'>('photo')

  useEffect(() => {
    if (!detailId) return
    setDensity(detailPrefill.density)
    setThickness(detailPrefill.thickness)
    setTab('photo')
  }, [detailId, detailPrefill])

  if (!detailId) return null

  const product = getProduct(detailId)
  const price = priceForDensity(density)

  const tech = [
    { k: t('tech.material'), v: t('tech.materialValue') },
    { k: t('tech.surface'), v: t('tech.surfaceValue') },
    { k: t('tech.cut'), v: t('tech.cutValue') },
    { k: t('tech.custom'), v: t('tech.customValue') },
  ]

  return (
    <Modal
      open={!!detailId}
      onClose={closeDetail}
      label={t(product.nameKey)}
      size="lg"
      closeLabel={t('btn.close')}
    >
      <div className="pdet">
        <div className="pdet__visual">
          <div className="pdet__tabs">
            <button
              type="button"
              className={`pdet__tab ${tab === 'photo' ? 'is-active' : ''}`}
              onClick={() => setTab('photo')}
            >
              Foto
            </button>
            <button
              type="button"
              className={`pdet__tab ${tab === '3d' ? 'is-active' : ''}`}
              onClick={() => setTab('3d')}
            >
              3D
            </button>
          </div>

          <div className="pdet__stage">
            {tab === 'photo' ? (
              <img
                className="pdet__img"
                src={product.image}
                alt={t(product.nameKey)}
                width={1000}
                height={667}
              />
            ) : (
              <FoamViewer
                color={product.viewerColor}
                quality="low"
                autoRotate
                loadingLabel={t('exp.loading')}
                fallbackImage={product.image}
                fallbackAlt={t(product.nameKey)}
                className="pdet__viewer"
              />
            )}
          </div>
        </div>

        <div className="pdet__info">
          <span className="badge">{t(product.shortKey)}</span>
          <h3 className="pdet__title">{t(product.nameKey)}</h3>
          <p className="pdet__desc">{t(product.descKey)}</p>

          <div className="pdet__selectors">
            <div className="field">
              <label className="field-label" htmlFor="pdet-density">
                {t('label.densityFull')}
              </label>
              <div className="select-wrap">
                <select
                  id="pdet-density"
                  className="select"
                  value={density}
                  onChange={(e) => setDensity(Number(e.target.value))}
                >
                  {product.densities.map((d) => (
                    <option key={d} value={d}>
                      {densityLabel(d)} — {formatPrice(priceForDensity(d))}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="pdet-thickness">
                {t('label.thickness')}
              </label>
              <div className="select-wrap">
                <select
                  id="pdet-thickness"
                  className="select"
                  value={thickness}
                  onChange={(e) => setThickness(Number(e.target.value))}
                >
                  {product.thicknesses.map((th) => (
                    <option key={th} value={th}>
                      {thicknessLabel(th)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pdet__price glass">
            <div className="pdet__pricecol">
              <span>{t('label.density')}</span>
              <b>{densityLabel(density)}</b>
            </div>
            <div className="pdet__pricecol">
              <span>{t('label.thickness')}</span>
              <b>{thicknessLabel(thickness)}</b>
            </div>
            <div className="pdet__pricecol">
              <span>{t('label.size')}</span>
              <b>{SHEET_SIZE_LABEL}</b>
            </div>
            <div className="pdet__pricecol pdet__pricecol--main">
              <span>{t('label.price')}</span>
              <b>{formatPrice(price)}</b>
            </div>
          </div>

          <div className="pdet__cols">
            <div className="pdet__block">
              <h4 className="pdet__blocktitle">{t('label.application')}</h4>
              <ul className="pdet__uses">
                {product.useKeys.map((k) => (
                  <li key={k}>
                    <IconCheck size={15} />
                    {t(k)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pdet__block">
              <h4 className="pdet__blocktitle">{t('label.tech')}</h4>
              <dl className="pdet__tech">
                {tech.map((row) => (
                  <div key={row.k}>
                    <dt>{row.k}</dt>
                    <dd>{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="pdet__actions">
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={() => {
                closeDetail()
                openOrder({ productId: product.id, density, thickness })
              }}
            >
              {t('btn.order')}
            </button>
            <a href={CONTACT.phoneHref} className="btn btn--glass btn--lg">
              <IconPhone size={16} />
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>
    </Modal>
  )
}

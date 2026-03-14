import React, { useState, useEffect } from 'react';
import type { CatalogType } from '../../pages/admin/AdminCatalogsPage';
import api from '../../api';
import { Edit2, Plus, X, Search, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../../components/Toast';

interface CatalogItem {
  id: string;
  name: string;
  type: CatalogType;
  isActive: boolean;
}

export default function CatalogItemList({ type }: { type: CatalogType }) {
  const { showToast } = useToast();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [formData, setFormData] = useState({ name: '', isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [type]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/catalogs/type/${type}`);
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching catalog items', err);
      showToast('Error al cargar elementos del catálogo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openNewModal = () => {
    setEditingItem(null);
    setFormData({ name: '', isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (item: CatalogItem) => {
    setEditingItem(item);
    setFormData({ name: item.name, isActive: item.isActive });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      if (editingItem) {
        // Edit mode
        await api.patch(`/catalogs/item/${editingItem.id}`, formData);
        showToast('Elemento actualizado correctamente', 'success');
      } else {
        // Create mode
        await api.post('/catalogs/item', { name: formData.name, type: type });
        showToast('Elemento creado correctamente', 'success');
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      if (err.response?.data?.error === 'ITEM_ALREADY_EXISTS') {
        showToast('Este nombre ya existe en el catálogo', 'error');
      } else {
        showToast('Error al guardar el elemento', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (item: CatalogItem) => {
    try {
      await api.patch(`/catalogs/item/${item.id}`, { isActive: !item.isActive });
      showToast(`Elemento ${!item.isActive ? 'activado' : 'desactivado'} con éxito`, 'success');
      fetchItems();
    } catch (error) {
      showToast('Error al cambiar el estado del elemento', 'error');
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={18} />
          <input
            type="text"
            placeholder="Buscar elemento administrativo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '40px', margin: 0, width: '100%' }}
          />
        </div>
        <button
          onClick={openNewModal}
          className="submit-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', width: 'auto', marginTop: 0 }}
        >
          <Plus size={18} />
          Nuevo Elemento
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px', color: 'var(--text-light)' }}>
            <span>Cargando elementos...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', backgroundColor: '#fafafa', border: '1px dashed var(--border)', margin: '20px', borderRadius: '8px' }}>
            <p style={{ color: 'var(--text-gray)', marginBottom: '8px', fontWeight: 500 }}>No se encontraron elementos.</p>
            {searchTerm ? (
              <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>Intenta buscar algo diferente</span>
            ) : (
              <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>Presiona "Nuevo Elemento" para comenzar</span>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)' }}>
            {filteredItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s', backgroundColor: 'white' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.isActive ? 'var(--success)' : 'var(--danger)' }}></span>
                  <span style={{ color: 'var(--text-dark)', fontWeight: 500, textDecoration: !item.isActive ? 'line-through' : 'none', opacity: !item.isActive ? 0.6 : 1 }}>
                      {item.name}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => toggleStatus(item)}
                    className={item.isActive ? 'btn-danger-outline' : 'btn-outline'}
                    style={{ 
                      padding: '8px', 
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    data-tooltip={item.isActive ? 'Desactivar' : 'Activar'}
                    data-tooltip-pos="left"
                  >
                    {item.isActive ? (
                        <XCircle size={18} strokeWidth={2.5} />
                    ) : (
                        <CheckCircle size={18} color="var(--success)" strokeWidth={2.5} />
                    )}
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="btn-outline"
                    style={{ 
                      padding: '8px', 
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    data-tooltip="Editar Nombre"
                    data-tooltip-pos="left"
                  >
                    <Edit2 size={18} color="var(--primary)" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal form */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ 
            width: '100%', 
            maxWidth: '450px', 
            padding: 0, 
            overflow: 'hidden', 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid var(--border)',
            animation: 'modalFadeIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '18px', fontWeight: 700 }}>
                {editingItem ? 'Editar Elemento' : 'Nuevo Elemento'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-light)', transition: 'all 0.2s' }}
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '24px' }}>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-gray)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                  Nombre del Elemento
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="Ej. Diabetes Mellitus"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '15px' }}
                />
              </div>

              {editingItem && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                  />
                  <label htmlFor="isActiveCheck" style={{ fontSize: '14px', color: 'var(--text-dark)', fontWeight: 500, cursor: 'pointer' }}>
                    Elemento Activo (visible en formularios)
                  </label>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-outline"
                  disabled={saving}
                  style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 600 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.name.trim()}
                  className="submit-btn"
                  style={{ width: 'auto', padding: '10px 32px', borderRadius: '10px' }}
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

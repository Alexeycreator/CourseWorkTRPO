import React, { useState, useEffect } from 'react';

export interface DocumentFormData {
  seria: string;
  number: string;
  issuedBy: string;
  dateOfIssue: string;
  departmentCode: string;
  type: string;
  id?: number;
}

export interface AddressFormData {
  country: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  id?: number;
}

export interface CombinedDocumentData {
  passport: DocumentFormData;
  address: AddressFormData;
  passportId?: number;
  addressId?: number;
  index?: number;
}

interface EditDocumentModalProps {
  open: boolean;
  data: CombinedDocumentData | null;
  onClose: () => void;
  onSave: (passportData: DocumentFormData, addressData: AddressFormData) => void;
  mode?: 'edit' | 'add';
}

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  open,
  data,
  onClose,
  onSave,
  mode = 'edit'
}) => {
  const [passportForm, setPassportForm] = useState<DocumentFormData>({
    seria: '',
    number: '',
    issuedBy: '',
    dateOfIssue: '',
    departmentCode: '',
    type: 'passport'
  });

  const [addressForm, setAddressForm] = useState<AddressFormData>({
    country: 'Российская Федерация',
    city: '',
    street: '',
    house: '',
    apartment: ''
  });

  const [passportErrors, setPassportErrors] = useState<Record<string, string>>({});
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data && open) {
      setPassportForm({
        seria: data.passport.seria || '',
        number: data.passport.number || '',
        issuedBy: data.passport.issuedBy || '',
        dateOfIssue: data.passport.dateOfIssue || '',
        departmentCode: data.passport.departmentCode || '',
        type: data.passport.type || 'passport',
        id: data.passport.id
      });

      setAddressForm({
        country: data.address.country || 'Российская Федерация',
        city: data.address.city || '',
        street: data.address.street || '',
        house: data.address.house || '',
        apartment: data.address.apartment || '',
        id: data.address.id
      });
    } else if (open && mode === 'add') {
      // Для режима добавления - пустые формы
      setPassportForm({
        seria: '',
        number: '',
        issuedBy: '',
        dateOfIssue: '',
        departmentCode: '',
        type: 'passport'
      });
      setAddressForm({
        country: 'Российская Федерация',
        city: '',
        street: '',
        house: '',
        apartment: ''
      });
    }
  }, [data, open, mode]);

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassportForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (passportErrors[name]) {
      setPassportErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (addressErrors[name]) {
      setAddressErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validatePassport = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!passportForm.seria?.trim()) {
      newErrors.seria = 'Серия паспорта обязательна';
    } else if (!/^\d{4}$/.test(passportForm.seria)) {
      newErrors.seria = 'Серия должна содержать 4 цифры';
    }
    
    if (!passportForm.number?.trim()) {
      newErrors.number = 'Номер паспорта обязателен';
    } else if (!/^\d{6}$/.test(passportForm.number)) {
      newErrors.number = 'Номер должен содержать 6 цифр';
    }
    
    if (!passportForm.issuedBy?.trim()) {
      newErrors.issuedBy = 'Кем выдан паспорт обязательно';
    }
    
    if (!passportForm.dateOfIssue) {
      newErrors.dateOfIssue = 'Дата выдачи обязательна';
    } else {
      const selectedDate = new Date(passportForm.dateOfIssue);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.dateOfIssue = 'Дата выдачи не может быть в будущем';
      }
    }
    
    if (!passportForm.departmentCode?.trim()) {
      newErrors.departmentCode = 'Код подразделения обязателен';
    } else if (!/^\d{3}-\d{3}$/.test(passportForm.departmentCode)) {
      newErrors.departmentCode = 'Код подразделения должен быть в формате 000-000';
    }

    setPassportErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddress = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!addressForm.city?.trim()) {
      newErrors.city = 'Город обязателен';
    }
    if (!addressForm.street?.trim()) {
      newErrors.street = 'Улица обязательна';
    }
    if (!addressForm.house?.trim()) {
      newErrors.house = 'Номер дома обязателен';
    }

    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    const isPassportValid = validatePassport();
    const isAddressValid = validateAddress();
    return isPassportValid && isAddressValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(passportForm, addressForm);
    }
  };

  const handleClose = () => {
    setPassportErrors({});
    setAddressErrors({});
    onClose();
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: '#FFF8F0',
        borderRadius: '30px',
        padding: '30px',
        maxWidth: '900px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '3px solid #C0A080',
        position: 'relative',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          borderBottom: '2px solid #D2B48C',
          paddingBottom: '15px'
        }}>
          <h3 style={{
            fontSize: '24px',
            color: '#8B5A2B',
            fontFamily: "'Cormorant Garamond', serif",
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>{mode === 'edit' ? '✏️' : '➕'}</span>
            {mode === 'edit' 
              ? `Редактирование документа ${data?.index !== undefined ? `#${data.index + 1}` : ''}`
              : 'Добавление нового документа'
            }
          </h3>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#8B5A2B',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(183, 110, 60, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Паспортные данные */}
          <div style={{
            marginBottom: '30px',
            padding: '20px',
            background: 'rgba(210, 180, 140, 0.05)',
            borderRadius: '20px',
            border: '1px solid #D2B48C'
          }}>
            <h4 style={{
              fontSize: '20px',
              color: '#B76E3C',
              fontFamily: "'Cormorant Garamond', serif",
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '1px dashed #D2B48C',
              paddingBottom: '10px'
            }}>
              <span>🪪</span> Паспортные данные
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  color: '#8B5A2B',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Серия паспорта <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  name="seria"
                  value={passportForm.seria}
                  onChange={handlePassportChange}
                  maxLength={4}
                  placeholder="0000"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${passportErrors.seria ? '#dc3545' : '#D2B48C'}`,
                    borderRadius: '15px',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                />
                {passportErrors.seria && (
                  <div style={{ 
                    color: '#dc3545', 
                    fontSize: '12px', 
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <span>⚠️</span> {passportErrors.seria}
                  </div>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#8B5A2B',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Номер паспорта <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  name="number"
                  value={passportForm.number}
                  onChange={handlePassportChange}
                  maxLength={6}
                  placeholder="000000"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${passportErrors.number ? '#dc3545' : '#D2B48C'}`,
                    borderRadius: '15px',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                />
                {passportErrors.number && (
                  <div style={{ 
                    color: '#dc3545', 
                    fontSize: '12px', 
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <span>⚠️</span> {passportErrors.number}
                  </div>
                )}
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{
                  display: 'block',
                  color: '#8B5A2B',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Кем выдан <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  name="issuedBy"
                  value={passportForm.issuedBy}
                  onChange={handlePassportChange}
                  placeholder="Наименование органа, выдавшего паспорт"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${passportErrors.issuedBy ? '#dc3545' : '#D2B48C'}`,
                    borderRadius: '15px',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                />
                {passportErrors.issuedBy && (
                  <div style={{ 
                    color: '#dc3545', 
                    fontSize: '12px', 
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <span>⚠️</span> {passportErrors.issuedBy}
                  </div>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#8B5A2B',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Дата выдачи <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="date"
                  name="dateOfIssue"
                  value={passportForm.dateOfIssue}
                  onChange={handlePassportChange}
                  max={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${passportErrors.dateOfIssue ? '#dc3545' : '#D2B48C'}`,
                    borderRadius: '15px',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                />
                {passportErrors.dateOfIssue && (
                  <div style={{ 
                    color: '#dc3545', 
                    fontSize: '12px', 
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <span>⚠️</span> {passportErrors.dateOfIssue}
                  </div>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#8B5A2B',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Код подразделения <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  name="departmentCode"
                  value={passportForm.departmentCode}
                  onChange={handlePassportChange}
                  placeholder="000-000"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${passportErrors.departmentCode ? '#dc3545' : '#D2B48C'}`,
                    borderRadius: '15px',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                />
                {passportErrors.departmentCode && (
                  <div style={{ 
                    color: '#dc3545', 
                    fontSize: '12px', 
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <span>⚠️</span> {passportErrors.departmentCode}
                  </div>
                )}
              </div>
            </div>

            <div style={{
              background: 'rgba(210, 180, 140, 0.1)',
              borderRadius: '15px',
              padding: '15px',
              marginTop: '20px',
              border: '1px dashed #D2B48C'
            }}>
              <p style={{
                margin: '0 0 10px 0',
                color: '#8B5A2B',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span>📌</span> Форматы ввода:
              </p>
              <ul style={{
                margin: 0,
                paddingLeft: '25px',
                color: '#5D3A1A',
                fontSize: '13px'
              }}>
                <li>Серия: 4 цифры (например: 4510)</li>
                <li>Номер: 6 цифр (например: 123456)</li>
                <li>Код подразделения: формат 000-000 (например: 123-456)</li>
              </ul>
            </div>
          </div>

          {/* Адрес регистрации */}
          <div style={{
            marginBottom: '30px',
            padding: '20px',
            background: 'rgba(210, 180, 140, 0.05)',
            borderRadius: '20px',
            border: '1px solid #D2B48C'
          }}>
            <h4 style={{
              fontSize: '20px',
              color: '#B76E3C',
              fontFamily: "'Cormorant Garamond', serif",
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '1px dashed #D2B48C',
              paddingBottom: '10px'
            }}>
              <span>📍</span> Адрес регистрации
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px'
            }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{
                  display: 'block',
                  color: '#8B5A2B',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Страна
                </label>
                <input
                  type="text"
                  name="country"
                  value={addressForm.country}
                  onChange={handleAddressChange}
                  placeholder="Российская Федерация"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${addressErrors.country ? '#dc3545' : '#D2B48C'}`,
                    borderRadius: '15px',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{
                  display: 'block',
                  color: '#8B5A2B',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Город <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  placeholder="Например: Москва"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${addressErrors.city ? '#dc3545' : '#D2B48C'}`,
                    borderRadius: '15px',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                />
                {addressErrors.city && (
                  <div style={{ 
                    color: '#dc3545', 
                    fontSize: '12px', 
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <span>⚠️</span> {addressErrors.city}
                  </div>
                )}
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{
                  display: 'block',
                  color: '#8B5A2B',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Улица <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={addressForm.street}
                  onChange={handleAddressChange}
                  placeholder="Например: Тверская"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${addressErrors.street ? '#dc3545' : '#D2B48C'}`,
                    borderRadius: '15px',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                />
                {addressErrors.street && (
                  <div style={{ 
                    color: '#dc3545', 
                    fontSize: '12px', 
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <span>⚠️</span> {addressErrors.street}
                  </div>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#8B5A2B',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Дом <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  name="house"
                  value={addressForm.house}
                  onChange={handleAddressChange}
                  placeholder="Например: 15"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${addressErrors.house ? '#dc3545' : '#D2B48C'}`,
                    borderRadius: '15px',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                />
                {addressErrors.house && (
                  <div style={{ 
                    color: '#dc3545', 
                    fontSize: '12px', 
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <span>⚠️</span> {addressErrors.house}
                  </div>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#8B5A2B',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Квартира
                </label>
                <input
                  type="text"
                  name="apartment"
                  value={addressForm.apartment}
                  onChange={handleAddressChange}
                  placeholder="Например: 42"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${addressErrors.apartment ? '#dc3545' : '#D2B48C'}`,
                    borderRadius: '15px',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                />
              </div>
            </div>

            <div style={{
              background: 'rgba(210, 180, 140, 0.1)',
              borderRadius: '15px',
              padding: '15px',
              marginTop: '20px',
              border: '1px dashed #D2B48C'
            }}>
              <p style={{
                margin: '0 0 10px 0',
                color: '#8B5A2B',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span>📌</span> Информация:
              </p>
              <ul style={{
                margin: 0,
                paddingLeft: '25px',
                color: '#5D3A1A',
                fontSize: '13px'
              }}>
                <li>Все поля обязательны, кроме квартиры</li>
                <li>Адрес должен соответствовать прописке в паспорте</li>
              </ul>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '30px'
          }}>
            <button
              type="submit"
              style={{
                padding: '15px 50px',
                background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                color: '#FFF8F0',
                border: '2px solid #D2B48C',
                borderRadius: '40px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 5px 15px rgba(183, 110, 60, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(183, 110, 60, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(183, 110, 60, 0.3)';
              }}
            >
              {mode === 'edit' ? 'Сохранить изменения' : 'Добавить документ'}
            </button>

            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '15px 30px',
                background: 'transparent',
                color: '#8B5A2B',
                border: '2px solid #D2B48C',
                borderRadius: '40px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(183, 110, 60, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDocumentModal;
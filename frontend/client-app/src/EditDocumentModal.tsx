import React, { useState, useEffect } from 'react';

export interface DocumentFormData {
  seria: string;
  number: string;
  issuedBy: string;
  dateOfIssue: string;
  dateOfExpiry?: string;
  departmentCode: string;
  type: string;
  gender?: string;
  placeOfBirth?: string;
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

// Функция для получения даты без времени
const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
    dateOfExpiry: '',
    departmentCode: '',
    type: 'internal'
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
        dateOfExpiry: data.passport.dateOfExpiry || '',
        departmentCode: data.passport.departmentCode || '',
        type: data.passport.type || 'internal',
        gender: (data.passport as any).gender || '',
        placeOfBirth: (data.passport as any).placeOfBirth || '',
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
      setPassportForm({
        seria: '',
        number: '',
        issuedBy: '',
        dateOfIssue: '',
        dateOfExpiry: '',
        departmentCode: '',
        type: 'internal',
        gender: '',
        placeOfBirth: ''
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

  const handleSeriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPassportForm(prev => ({ ...prev, seria: value }));
    if (passportErrors.seria) {
      setPassportErrors(prev => { const newErrors = { ...prev }; delete newErrors.seria; return newErrors; });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, passportForm.type === 'internal' ? 6 : 9);
    setPassportForm(prev => ({ ...prev, number: value }));
    if (passportErrors.number) {
      setPassportErrors(prev => { const newErrors = { ...prev }; delete newErrors.number; return newErrors; });
    }
  };

  const handleDepartmentCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d-]/g, '');
    if (value.length === 3 && !value.includes('-')) {
      value = value + '-';
    }
    value = value.slice(0, 7);
    setPassportForm(prev => ({ ...prev, departmentCode: value }));
    if (passportErrors.departmentCode) {
      setPassportErrors(prev => { const newErrors = { ...prev }; delete newErrors.departmentCode; return newErrors; });
    }
  };

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPassportForm(prev => ({ ...prev, [name]: value }));
    if (passportErrors[name]) {
      setPassportErrors(prev => { const newErrors = { ...prev }; delete newErrors[name]; return newErrors; });
    }
  };

  const handlePlaceOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^а-яА-Яa-zA-Z\s\-\.\,]/g, '');
    setPassportForm(prev => ({ ...prev, placeOfBirth: value }));
    if ((passportErrors as any).placeOfBirth) {
      setPassportErrors(prev => { const newErrors = { ...prev }; delete newErrors.placeOfBirth; return newErrors; });
    }
  };

  const handleHouseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\dа-яА-Яa-zA-Z/\\-]/g, '');
    setAddressForm(prev => ({ ...prev, house: value }));
    if (addressErrors.house) {
      setAddressErrors(prev => { const newErrors = { ...prev }; delete newErrors.house; return newErrors; });
    }
  };

  const handleApartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAddressForm(prev => ({ ...prev, apartment: value }));
    if (addressErrors.apartment) {
      setAddressErrors(prev => { const newErrors = { ...prev }; delete newErrors.apartment; return newErrors; });
    }
  };

  const handleTextAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/[^а-яА-Яa-zA-Z\s\-\.]/g, '');
    
    if (name === 'city') {
      setAddressForm(prev => ({ ...prev, city: filteredValue }));
      if (addressErrors.city) {
        setAddressErrors(prev => { const newErrors = { ...prev }; delete newErrors.city; return newErrors; });
      }
    } else if (name === 'street') {
      setAddressForm(prev => ({ ...prev, street: filteredValue }));
      if (addressErrors.street) {
        setAddressErrors(prev => { const newErrors = { ...prev }; delete newErrors.street; return newErrors; });
      }
    } else if (name === 'country') {
      setAddressForm(prev => ({ ...prev, country: filteredValue }));
    }
  };

  const validatePassport = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!passportForm.seria?.trim()) {
      newErrors.seria = 'Серия паспорта обязательна';
    } else if (!/^\d{4}$/.test(passportForm.seria)) {
      newErrors.seria = 'Серия должна содержать ровно 4 цифры';
    }

    const numberLength = passportForm.type === 'internal' ? 6 : 9;
    if (!passportForm.number?.trim()) {
      newErrors.number = 'Номер паспорта обязателен';
    } else if (!new RegExp(`^\\d{${numberLength}}$`).test(passportForm.number)) {
      newErrors.number = `Номер должен содержать ровно ${numberLength} цифр`;
    }

    if (!passportForm.issuedBy?.trim()) {
      newErrors.issuedBy = 'Кем выдан паспорт обязательно';
    } else if (passportForm.issuedBy.length < 5) {
      newErrors.issuedBy = 'Введите полное наименование органа';
    }

    if (!passportForm.dateOfIssue) {
      newErrors.dateOfIssue = 'Дата выдачи обязательна';
    } else {
      const selectedDate = new Date(passportForm.dateOfIssue);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 100);
      
      if (selectedDate > today) {
        newErrors.dateOfIssue = 'Дата выдачи не может быть в будущем';
      } else if (selectedDate < minDate) {
        newErrors.dateOfIssue = 'Дата выдачи не может быть более 100 лет назад';
      }
    }

    if (passportForm.type === 'foreign') {
      if (!passportForm.dateOfExpiry) {
        newErrors.dateOfExpiry = 'Срок действия обязателен';
      } else {
        const expiryDate = new Date(passportForm.dateOfExpiry);
        const today = new Date();
        if (expiryDate < today) {
          newErrors.dateOfExpiry = 'Срок действия истёк';
        }
      }
    }

    if (passportForm.type === 'internal') {
      if (!passportForm.departmentCode?.trim()) {
        newErrors.departmentCode = 'Код подразделения обязателен';
      } else if (!/^\d{3}-\d{3}$/.test(passportForm.departmentCode)) {
        newErrors.departmentCode = 'Код подразделения должен быть в формате 000-000';
      }
    }

    if (passportForm.placeOfBirth?.trim()) {
      if (passportForm.placeOfBirth.length < 5) {
        newErrors.placeOfBirth = 'Место рождения должно содержать минимум 5 символов';
      } else if (!/^[а-яА-Яa-zA-Z\s\-\.\,]+$/.test(passportForm.placeOfBirth)) {
        newErrors.placeOfBirth = 'Место рождения должно содержать только буквы, пробелы, дефисы, точки и запятые';
      }
    }

    setPassportErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddress = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!addressForm.city?.trim()) {
      newErrors.city = 'Город обязателен';
    } else if (addressForm.city.length < 3) {
      newErrors.city = 'Название города должно содержать минимум 3 символа';
    } else if (!/^[а-яА-Яa-zA-Z\s\-\.]+$/.test(addressForm.city)) {
      newErrors.city = 'Город должен содержать только буквы, пробелы, дефисы и точки';
    }

    if (!addressForm.street?.trim()) {
      newErrors.street = 'Улица обязательна';
    } else if (addressForm.street.length < 3) {
      newErrors.street = 'Название улицы должно содержать минимум 3 символа';
    } else if (!/^[а-яА-Яa-zA-Z\s\-\.]+$/.test(addressForm.street)) {
      newErrors.street = 'Улица должна содержать только буквы, пробелы, дефисы и точки';
    }

    if (!addressForm.house?.trim()) {
      newErrors.house = 'Номер дома обязателен';
    } else if (!/^[\d\/\\\-]+[а-яА-Яa-zA-Z]?$/.test(addressForm.house)) {
      newErrors.house = 'Номер дома должен содержать цифры, возможно букву или дробь';
    }

    if (addressForm.apartment && !/^\d+$/.test(addressForm.apartment)) {
      newErrors.apartment = 'Номер квартиры должен содержать только цифры';
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
              {/* Тип документа */}
              <div style={{ gridColumn: 'span 2', marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontWeight: '500' }}>
                  Тип документа
                </label>
                <select
                  name="type"
                  value={passportForm.type}
                  onChange={handlePassportChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #D2B48C',
                    borderRadius: '15px',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                >
                  <option value="internal">Паспорт РФ</option>
                  <option value="foreign">Загранпаспорт</option>
                </select>
              </div>

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
                  onChange={handleSeriaChange}
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
                  onChange={handleNumberChange}
                  maxLength={passportForm.type === 'internal' ? 6 : 9}
                  placeholder={passportForm.type === 'internal' ? '000000' : '000000000'}
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
                  max={getDateString(new Date())}
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

              {passportForm.type === 'foreign' ? (
                <div>
                  <label style={{
                    display: 'block',
                    color: '#8B5A2B',
                    fontSize: '14px',
                    marginBottom: '5px',
                    fontWeight: '500'
                  }}>
                    Срок действия <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfExpiry"
                    value={passportForm.dateOfExpiry || ''}
                    onChange={handlePassportChange}
                    min={getDateString(new Date())}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${passportErrors.dateOfExpiry ? '#dc3545' : '#D2B48C'}`,
                      borderRadius: '15px',
                      backgroundColor: '#FFF8F0',
                      color: '#8B5A2B',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                  />
                  {passportErrors.dateOfExpiry && (
                    <div style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <span>⚠️</span> {passportErrors.dateOfExpiry}
                    </div>
                  )}
                </div>
              ) : (
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
                    onChange={handleDepartmentCodeChange}
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
              )}

              {/* Пол */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#8B5A2B',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Пол
                </label>
                <div style={{ display: 'flex', gap: '20px', padding: '12px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B' }}>
                    <input
                      type="radio"
                      name="gender"
                      value="Мужской"
                      checked={passportForm.gender === 'Мужской'}
                      onChange={handlePassportChange}
                    />
                    Мужской
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B' }}>
                    <input
                      type="radio"
                      name="gender"
                      value="Женский"
                      checked={passportForm.gender === 'Женский'}
                      onChange={handlePassportChange}
                    />
                    Женский
                  </label>
                </div>
              </div>

              <div></div>

              {/* Место рождения */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{
                  display: 'block',
                  color: '#8B5A2B',
                  fontSize: '14px',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Место рождения
                </label>
                <input
                  type="text"
                  name="placeOfBirth"
                  value={passportForm.placeOfBirth || ''}
                  onChange={handlePlaceOfBirthChange}
                  placeholder="г. Москва, Россия"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${(passportErrors as any).placeOfBirth ? '#dc3545' : '#D2B48C'}`,
                    borderRadius: '15px',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                />
                {(passportErrors as any).placeOfBirth && (
                  <div style={{
                    color: '#8B0000',
                    fontSize: '12px',
                    marginTop: '5px',
                    marginLeft: '5px'
                  }}>
                    {(passportErrors as any).placeOfBirth}
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
                <li>Номер: {passportForm.type === 'internal' ? '6 цифр' : '9 цифр'} (например: {passportForm.type === 'internal' ? '123456' : '123456789'})</li>
                {passportForm.type === 'internal' && <li>Код подразделения: формат 000-000 (например: 123-456)</li>}
                <li>Место рождения: минимум 5 символов, только буквы</li>
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
                  onChange={handleTextAddressChange}
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
                  onChange={handleTextAddressChange}
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
                  onChange={handleTextAddressChange}
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
                  onChange={handleHouseChange}
                  placeholder="Например: 15 или 15к1 или 15/2"
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
                  onChange={handleApartmentChange}
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
                {addressErrors.apartment && (
                  <div style={{
                    color: '#dc3545',
                    fontSize: '12px',
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <span>⚠️</span> {addressErrors.apartment}
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
                <span>📌</span> Информация:
              </p>
              <ul style={{
                margin: 0,
                paddingLeft: '25px',
                color: '#5D3A1A',
                fontSize: '13px'
              }}>
                <li>Город: минимум 3 символа, только буквы</li>
                <li>Улица: минимум 3 символа, только буквы</li>
                <li>Номер дома: цифры, буква или дробь (например: 15, 15к2, 15/2)</li>
                <li>Квартира: только цифры</li>
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
import React, { useState, FormEvent, useRef, useEffect } from "react";

const CatalogToursPage = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [nights, setNights] = useState(7);

  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);

  const [guestSelectorPosition, setGuestSelectorPosition] = useState({ top: 0, left: 0, width: 0 });
  const [dateSelectorPosition, setDateSelectorPosition] = useState({ top: 0, left: 0, width: 0 });

  const guestSelectorRef = useRef<HTMLDivElement>(null);
  const guestDisplayRef = useRef<HTMLDivElement>(null);
  const dateSelectorRef = useRef<HTMLDivElement>(null);
  const dateDisplayRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const cityOptions = [
    "Москва", "Санкт-Петербург", "Сочи", "Калининград", "Казань",
    "Анталия", "Стамбул", "Бангкок", "Пхукет", "Дубай",
    "Шарм-эль-Шейх", "Хургада",
  ];

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        guestSelectorRef.current &&
        !guestSelectorRef.current.contains(event.target as Node) &&
        guestDisplayRef.current &&
        !guestDisplayRef.current.contains(event.target as Node)
      ) {
        setIsGuestSelectorOpen(false);
      }
      if (
        dateSelectorRef.current &&
        !dateSelectorRef.current.contains(event.target as Node) &&
        dateDisplayRef.current &&
        !dateDisplayRef.current.contains(event.target as Node)
      ) {
        setIsDateSelectorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateGuestSelectorPosition = () => {
    if (guestDisplayRef.current && formRef.current) {
      const displayRect = guestDisplayRef.current.getBoundingClientRect();
      const formRect = formRef.current.getBoundingClientRect();
      setGuestSelectorPosition({
        top: displayRect.bottom - formRect.top,
        left: displayRect.left - formRect.left - 50,
        width: displayRect.width + 100,               
      });
    }
  };

  const updateDateSelectorPosition = () => {
    if (dateDisplayRef.current && formRef.current) {
      const displayRect = dateDisplayRef.current.getBoundingClientRect();
      const formRect = formRef.current.getBoundingClientRect();
      setDateSelectorPosition({
        top: displayRect.bottom - formRect.top,
        left: displayRect.left - formRect.left - 50,
        width: displayRect.width + 100,
      });
    }
  };

  useEffect(() => {
    if (isGuestSelectorOpen) {
      updateGuestSelectorPosition();
      const handleResizeOrScroll = () => updateGuestSelectorPosition();
      window.addEventListener('resize', handleResizeOrScroll);
      window.addEventListener('scroll', handleResizeOrScroll, true);
      return () => {
        window.removeEventListener('resize', handleResizeOrScroll);
        window.removeEventListener('scroll', handleResizeOrScroll, true);
      };
    }
  }, [isGuestSelectorOpen]);

  useEffect(() => {
    if (isDateSelectorOpen) {
      updateDateSelectorPosition();
      const handleResizeOrScroll = () => updateDateSelectorPosition();
      window.addEventListener('resize', handleResizeOrScroll);
      window.addEventListener('scroll', handleResizeOrScroll, true);
      return () => {
        window.removeEventListener('resize', handleResizeOrScroll);
        window.removeEventListener('scroll', handleResizeOrScroll, true);
      };
    }
  }, [isDateSelectorOpen]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { departure, destination, startDate, endDate, adults, children, nights };
    console.log("Данные для тура:", formData);
    alert("Запрос на формирование тура отправлен (смотрите консоль)");
  };

  const getGuestsDisplayText = () => {
    const parts = [];
    parts.push(`${adults} ${adults === 1 ? 'взрослый' : 'взрослых'}`);
    if (children > 0) {
      parts.push(`${children} ${children === 1 ? 'ребенок' : 'детей'}`);
    }
    return parts.join(', ');
  };

  const getDatesDisplayText = () => {
    if (startDate && endDate) {
      const formatDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
      };
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return "Выберите даты";
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    if (endDate && newStart > endDate) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    if (startDate && newEnd < startDate) {
      return;
    }
    setEndDate(newEnd);
  };

  const handleApplyDates = () => {
    if (startDate && endDate) {
      setIsDateSelectorOpen(false);
    } else {
      alert("Пожалуйста, выберите обе даты");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Каталог туров</h1>
      <div className="alert alert-secondary mb-4" role="alert">
        На данный момент мы обновляем каталог, но вы можете предварительно подобрать тур:
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="border rounded-4 p-4 bg-light shadow-sm position-relative"
      >
        <div className="d-flex flex-nowrap gap-3 overflow-auto pb-2 align-items-center">
          {/* Откуда */}
          <div style={{ minWidth: "140px" }} className="d-flex flex-column">
            <small className="text-muted mb-1">Откуда</small>
            <input
              type="text"
              className="form-control rounded-pill"
              list="cities"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              required
              placeholder="Москва"
            />
          </div>
          {/* Куда */}
          <div style={{ minWidth: "140px" }} className="d-flex flex-column">
            <small className="text-muted mb-1">Куда</small>
            <input
              type="text"
              className="form-control rounded-pill"
              list="cities"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              placeholder="Анталия"
            />
          </div>
          <datalist id="cities">
            {cityOptions.map(city => <option key={city} value={city} />)}
          </datalist>

          {/* Даты */}
          <div style={{ width: "220px" }} className="d-flex flex-column">
            <small className="text-muted mb-1">Диапазон дат подбора туров</small>
            <div
              ref={dateDisplayRef}
              className="form-control rounded-pill d-flex align-items-center justify-content-between cursor-pointer"
              onClick={() => {
                updateDateSelectorPosition();
                setIsDateSelectorOpen(!isDateSelectorOpen);
                if (isGuestSelectorOpen) setIsGuestSelectorOpen(false);
              }}
              style={{ cursor: 'pointer', backgroundColor: '#fff' }}
            >
              <span>{getDatesDisplayText()}</span>
              <span className="ms-2">▼</span>
            </div>
          </div>

          {/* Туристы */}
          <div style={{ width: "220px" }} className="d-flex flex-column">
            <small className="text-muted mb-1">Туристы</small>
            <div
              ref={guestDisplayRef}
              className="form-control rounded-pill d-flex align-items-center justify-content-between cursor-pointer"
              onClick={() => {
                updateGuestSelectorPosition();
                setIsGuestSelectorOpen(!isGuestSelectorOpen);
                if (isDateSelectorOpen) setIsDateSelectorOpen(false);
              }}
              style={{ cursor: 'pointer', backgroundColor: '#fff' }}
            >
              <span>{getGuestsDisplayText()}</span>
              <span className="ms-2">▼</span>
            </div>
          </div>

          {/* Ночей */}
          <div style={{ minWidth: "70px", maxWidth: "150px" }} className="d-flex flex-column">
            <small className="text-muted mb-1">Ночей</small>
            <input
              type="number"
              className="form-control rounded-pill"
              min="1"
              value={nights}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setNights(val >= 1 ? val : 1);
              }}
              required
            />
          </div>

          {/* Кнопка */}
          <div style={{ minWidth: "120px" }} className="d-flex flex-column justify-content-end">
            <button type="submit" className="btn btn-primary rounded-pill w-100">
              Сформировать
            </button>
          </div>
        </div>

        {/* Выпадающий блок выбора туристов */}
        {isGuestSelectorOpen && (
          <div
            ref={guestSelectorRef}
            className="position-absolute bg-white border rounded-3 shadow p-3 mt-1"
            style={{
              zIndex: 1000,
              top: guestSelectorPosition.top,
              left: guestSelectorPosition.left,
              width: guestSelectorPosition.width,
            }}
          >
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Взрослые</span>
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm rounded-circle"
                    onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                    style={{ width: '32px', height: '32px' }}
                  >
                    −
                  </button>
                  <span className="mx-3" style={{ minWidth: '20px', textAlign: 'center' }}>{adults}</span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm rounded-circle"
                    onClick={() => setAdults(prev => prev + 1)}
                    style={{ width: '32px', height: '32px' }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Дети</span>
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm rounded-circle"
                    onClick={() => setChildren(prev => Math.max(0, prev - 1))}
                    style={{ width: '32px', height: '32px' }}
                  >
                    −
                  </button>
                  <span className="mx-3" style={{ minWidth: '20px', textAlign: 'center' }}>{children}</span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm rounded-circle"
                    onClick={() => setChildren(prev => prev + 1)}
                    style={{ width: '32px', height: '32px' }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary w-100 rounded-pill"
              onClick={() => setIsGuestSelectorOpen(false)}
            >
              Готово
            </button>
          </div>
        )}

        {/* Выпадающий блок выбора дат */}
        {isDateSelectorOpen && (
          <div
            ref={dateSelectorRef}
            className="position-absolute bg-white border rounded-3 shadow p-3 mt-1"
            style={{
              zIndex: 1000,
              top: dateSelectorPosition.top,
              left: dateSelectorPosition.left,
              width: dateSelectorPosition.width,
            }}
          >
            <div className="mb-3">
              <div className="mb-2">
                <label className="form-label small text-muted">Туры подбираются с:</label>
                <input
                  type="date"
                  className="form-control rounded-pill"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={today}
                />
              </div>
              <div>
                <label className="form-label small text-muted">Туры подбираются по:</label>
                <input
                  type="date"
                  className="form-control rounded-pill"
                  value={endDate}
                  onChange={handleEndDateChange}
                  min={startDate || today}
                />
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary w-100 rounded-pill"
              onClick={handleApplyDates}
            >
              Применить
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export { CatalogToursPage };
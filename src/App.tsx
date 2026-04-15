import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Check, Loader2, ChevronLeft, ChevronRight, Star, Shield, Award, Quote, Phone, Mail } from 'lucide-react';
import sClassImage from './assets/cars/s-class.png';
import gClassImage from './assets/cars/g-class.png';

const BRAND_NAME = 'VipTransferBialystok';
const BRAND_DISPLAY = 'VIP Transfer Białystok';
const CONTACT_PHONE_DISPLAY = '600 479 905';
const CONTACT_PHONE_TEL = '+48600479905';
/** Podmień na docelowy adres e-mail. */
const CONTACT_EMAIL = 'kontakt@viptransferbialystok.pl';

const cars = [
  {
    id: 's-class',
    name: 'Mercedes-Benz S-Klasa',
    tag: 'Flota Flagowa 2025',
    seats: '3-4 Pasażerów',
    luggage: '3 Duże Walizki',
    basePrice: 2000,
    imageUrl: sClassImage,
    imageClassName: 'scale-[1.09]'
  },
  {
    id: 'g-class',
    name: 'Mercedes-Benz G-Klasa',
    tag: 'Ikona Stylu 2024',
    seats: '3-4 Pasażerów',
    luggage: '4 Duże Walizki',
    basePrice: 2000,
    imageUrl: gClassImage,
    imageClassName: 'scale-[1.01]'
  }
];

const testimonials = [
  {
    id: 1,
    text: "Profesjonalny, licencjonowany przewóz — w cenie był kierowca i pełna obsługa przewoźnika, bez żadnych niespodzianek. Auto w idealnym stanie, punktualność na najwyższym poziomie. Polecam VipTransferBiałystok każdemu, kto ceni spokój i przejrzyste zasady.",
    author: "Michał K.",
    rating: 5
  },
  {
    id: 2,
    text: "Zleciliśmy całodniowy przejazd dla zarządu. W wycenie od razu było widać, że usługa przewoźnika jest wliczona — dyskretny kierowca, auto reprezentacyjne, zero chaosu przy rozliczeniu. Firma godna zaufania.",
    author: "Anna W.",
    rating: 5
  },
  {
    id: 3,
    text: "G-Klasa na ślub z pakietem dekoracji — goście byli zachwyceni, a my mieliśmy pewność, że przewóz jest realizowany przez przewoźnika z odpowiednimi uprawnieniami. Całość na najwyższym poziomie.",
    author: "Karolina",
    rating: 5
  }
];

type BookingMode = 'transfer' | 'hourly' | 'fullday';

interface AddressInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  icon: any;
  iconClassName?: string;
}

function AddressInput({ label, value, onChange, placeholder, icon: Icon, iconClassName }: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(value)}&limit=5`);
        const data = await res.json();
        setSuggestions(data.features || []);
        setIsOpen(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (suggestion: any) => {
    const p = suggestion.properties;
    const mainText = p.name;
    const subTextParts = [p.street, p.city, p.state, p.country].filter(Boolean);
    const subText = Array.from(new Set(subTextParts)).filter(x => x !== mainText).join(', ');
    
    const fullAddress = subText ? `${mainText}, ${subText}` : mainText;
    onChange(fullAddress);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={wrapperRef}>
      <label className="text-[10px] text-accent font-bold tracking-wider uppercase">{label}</label>
      <div className="relative">
        <Icon className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 ${iconClassName || 'text-accent'}`} />
        <input
          type="text"
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => value.length >= 3 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent border-b border-[#333] pb-2 pl-7 text-sm text-white focus:outline-none focus:border-accent transition-colors placeholder:text-[#555]"
        />
        {loading && <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted animate-spin" />}
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white text-black rounded shadow-2xl z-50 overflow-hidden border border-gray-200">
          {suggestions.map((s, i) => {
            const p = s.properties;
            const mainText = p.name;
            const subTextParts = [p.street, p.city, p.state, p.country].filter(Boolean);
            const subText = Array.from(new Set(subTextParts)).filter(x => x !== mainText).join(', ');
            
            return (
              <div 
                key={i} 
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center gap-3 transition-colors"
                onClick={() => handleSelect(s)}
              >
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-gray-900 truncate">{mainText}</span>
                  {subText && <span className="text-xs text-gray-500 truncate">{subText}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [carIndex, setCarIndex] = useState(0);
  const [bookingCarId, setBookingCarId] = useState<string>(cars[0].id);
  const [bookingMode, setBookingMode] = useState<BookingMode>('transfer');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [hours, setHours] = useState<number>(1);
  const [distance, setDistance] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [weddingPackage, setWeddingPackage] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsCalculated(false);
    setDistance(null);
  }, [origin, destination]);

  useEffect(() => {
    setIsCalculated(false);
  }, [bookingCarId, hours, bookingMode]);

  useEffect(() => {
    if (bookingMode === 'transfer') {
      setWeddingPackage(false);
    }
  }, [bookingMode]);

  const handleCalculate = async () => {
    if (!origin) {
      alert("Proszę podać miejsce odbioru.");
      return;
    }
    if (bookingMode === 'transfer' && !destination) {
      alert("Proszę podać cel dla transferu.");
      return;
    }

    setIsCalculating(true);
    try {
      if (origin && destination) {
        const res1 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(origin)}`);
        const data1 = await res1.json();
        const res2 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`);
        const data2 = await res2.json();

        if (data1.length > 0 && data2.length > 0) {
          const lon1 = data1[0].lon, lat1 = data1[0].lat;
          const lon2 = data2[0].lon, lat2 = data2[0].lat;
          const routeRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`);
          const routeData = await routeRes.json();

          if (routeData.routes && routeData.routes.length > 0) {
            setDistance(Math.ceil(routeData.routes[0].distance / 1000));
          } else {
            alert("Nie udało się wyznaczyć trasy. Spróbuj wpisać dokładniejszy adres.");
            setDistance(0);
          }
        } else {
          alert("Nie znaleziono podanych adresów. Spróbuj wpisać dokładniejszy adres.");
          setDistance(0);
        }
      } else {
        setDistance(0);
      }
      setIsCalculated(true);
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd podczas wyceny.");
    } finally {
      setIsCalculating(false);
    }
  };

  const nextCar = () => setCarIndex((prev) => (prev + 1) % cars.length);
  const prevCar = () => setCarIndex((prev) => (prev - 1 + cars.length) % cars.length);

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const car = cars[carIndex];
  const bookingCar = cars.find((c) => c.id === bookingCarId) ?? cars[0];

  // Pricing Logic
  let total = 0;
  let baseText = '';
  let distanceText = '';
  let extraDist = 0;
  let distCost = 0;
  let baseCost = 0;

  if (bookingMode === 'transfer') {
    baseCost = bookingCar.basePrice;
    baseText = `Opłata bazowa (${bookingCar.name})`;
    extraDist = distance ? Math.max(0, distance - 150) : 0;
    distCost = extraDist * 10;
    if (extraDist > 0) distanceText = `Dopłata za dystans (${extraDist} km x 10 PLN)`;
    total = baseCost + distCost;
  } else if (bookingMode === 'hourly') {
    const h = Math.max(1, hours);
    const firstHour = 1400;
    const extraHours = Math.max(0, h - 1);
    baseCost = firstHour + extraHours * 300;
    baseText =
      h === 1
        ? `Wynajem na godziny (1h — ${firstHour} PLN)`
        : `Wynajem na godziny (${h}h — ${firstHour} PLN + ${extraHours}×300 PLN)`;
    const includedKm = h * 20;
    extraDist = distance != null ? Math.max(0, distance - includedKm) : 0;
    distCost = extraDist * 10;
    if (extraDist > 0) {
      distanceText = `Dopłata za km powyżej limitu (${includedKm} km w pakiecie, +${extraDist} km × 10 PLN)`;
    }
    total = baseCost + distCost + (weddingPackage ? 600 : 0);
  } else if (bookingMode === 'fullday') {
    const includedKmFullDay = 250;
    baseCost = 3500;
    baseText = `Pakiet całodniowy (8h, do ${includedKmFullDay} km w cenie)`;
    extraDist = distance != null ? Math.max(0, distance - includedKmFullDay) : 0;
    distCost = extraDist * 12;
    if (extraDist > 0) {
      distanceText = `Dopłata za km powyżej ${includedKmFullDay} km (${extraDist} km × 12 PLN)`;
    }
    total = baseCost + distCost + (weddingPackage ? 600 : 0);
  }

  return (
    <div className="w-full flex flex-col bg-bg text-text-main font-sans overflow-x-hidden">
      {/* Header */}
      <header className="flex justify-between items-center p-6 lg:px-12 lg:py-8 border-b border-border shrink-0 relative z-50 bg-bg/90 backdrop-blur-md sticky top-0">
        <div className="font-display text-xl lg:text-2xl font-bold tracking-[2px] text-accent">
          {BRAND_DISPLAY}
        </div>
        <div className="text-xs lg:text-sm tracking-[1px] text-text-muted hidden sm:block">
          +48 {CONTACT_PHONE_DISPLAY} &bull; BIAŁYSTOK, POLSKA
        </div>
      </header>

      {/* Hero Section (Carousel + Booking) */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_500px] min-h-[calc(100vh-90px)] relative">
        
        {/* Showcase Section */}
        <div className="relative p-8 lg:p-12 xl:p-14 flex flex-col justify-center border-r border-border overflow-hidden bg-bg min-h-[640px]">

          {/* Car Info */}
          <div className="relative z-10 max-w-5xl w-full mx-auto lg:mx-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${carIndex}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col h-full"
              >
                <div className="mb-7 lg:mb-8">
                  <span className="text-accent uppercase tracking-[4px] text-xs lg:text-sm mb-3 block font-medium">
                    {car.tag}
                  </span>
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-[62px] xl:text-[76px] leading-[1.02] tracking-tight">
                    {car.name}
                  </h1>
                </div>
                
                <div className="flex flex-wrap gap-8 lg:gap-12 mb-6 lg:mb-7">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] lg:text-xs text-text-muted uppercase tracking-[1px] font-bold">Miejsca</span>
                    <span className="text-sm lg:text-base font-medium">{car.seats}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] lg:text-xs text-text-muted uppercase tracking-[1px] font-bold">Bagaże</span>
                    <span className="text-sm lg:text-base font-medium">{car.luggage}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] lg:text-xs text-text-muted uppercase tracking-[1px] font-bold">Baza</span>
                    <span className="text-sm lg:text-base font-medium text-accent">od {car.basePrice} PLN</span>
                  </div>
                </div>
                <p className="text-[12px] lg:text-sm text-text-muted leading-relaxed max-w-2xl mb-8 lg:mb-9 border-l-2 border-accent/40 pl-4">
                  <span className="text-white/90 font-medium">{BRAND_DISPLAY}</span> oferuje przewozy pasażerskie w modelu z pełną obsługą licencjonowanego przewoźnika — kierowca, zgłoszenie przewozu oraz standardy bezpieczeństwa są uwzględnione w ramach usługi. Pokazane stawki przy wycenie odnoszą się do kompletnej usługi z przewoźnikiem, bez dopłat „za kierowcę” w drodze.
                </p>

                {/* Car Image Wrapper */}
                <div className="w-full h-[320px] sm:h-[390px] lg:h-[480px] xl:h-[520px] relative flex items-center justify-center mb-7 lg:mb-8 overflow-visible">
                  {/* Decorative glow behind the car */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.18)_0%,_rgba(212,175,55,0.06)_35%,_transparent_74%)] z-0"></div>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-black/45 blur-xl rounded-full z-0"></div>

                  {!imageErrors[car.id] ? (
                    <motion.img
                      key={`img-${carIndex}`}
                      initial={{ opacity: 0, x: 50, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -50, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      src={car.imageUrl}
                      alt={car.name}
                      onError={() => handleImageError(car.id)}
                      className={`relative z-10 h-full w-full max-h-full object-contain object-center drop-shadow-[0_24px_35px_rgba(0,0,0,0.72)] ${car.imageClassName || ''}`}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.05)] to-transparent rounded border border-dashed border-[#333] relative flex items-center justify-center overflow-hidden z-10">
                      <div className="text-center text-text-muted relative z-10">
                        <div className="text-3xl lg:text-5xl font-display mb-2 text-white/80">{car.name}</div>
                        <div className="text-[10px] lg:text-xs tracking-[3px] uppercase">Wizualizacja niedostępna</div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={prevCar}
                    aria-label="Poprzedni samochód"
                    className="absolute left-0 sm:-left-2 lg:-left-6 top-1/2 -translate-y-1/2 w-14 h-14 lg:w-[76px] lg:h-[76px] border border-border/80 hover:border-accent bg-[#090909]/78 hover:bg-[#111111]/95 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 rounded-full group cursor-pointer z-20 shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
                  >
                    <ChevronLeft className="w-7 h-7 lg:w-8 lg:h-8 group-hover:text-accent transition-colors" />
                  </button>
                  <button
                    onClick={nextCar}
                    aria-label="Następny samochód"
                    className="absolute right-0 sm:-right-2 lg:-right-6 top-1/2 -translate-y-1/2 w-14 h-14 lg:w-[76px] lg:h-[76px] border border-border/80 hover:border-accent bg-[#090909]/78 hover:bg-[#111111]/95 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 rounded-full group cursor-pointer z-20 shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
                  >
                    <ChevronRight className="w-7 h-7 lg:w-8 lg:h-8 group-hover:text-accent transition-colors" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 mt-2 lg:mt-3">
                  {cars.map((fleetCar, idx) => (
                    <button
                      key={fleetCar.id}
                      onClick={() => setCarIndex(idx)}
                      aria-label={`Pokaż ${fleetCar.name}`}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === carIndex ? 'w-12 bg-accent' : 'w-6 bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Booking Panel */}
        <div className="bg-surface p-6 lg:p-10 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-border relative z-20 shadow-2xl lg:shadow-none">
          <div className="flex flex-col gap-4 mb-2">
            <h2 className="text-xl lg:text-2xl font-bold leading-tight font-display">Wycena &<br/>Rezerwacja</h2>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Wszystkie orientacyjne kwoty poniżej obejmują{' '}
              <span className="text-white/85">usługę licencjonowanego przewoźnika</span> — w cenie jest przewóz osób z kierowcą,
              zgodnie z obowiązującymi przepisami, bez ukrytych dopłat za „prowadzenie pojazdu”. Ostateczne warunki potwierdzamy przy rezerwacji.
            </p>
            <div className="flex bg-[#1a1a1a] rounded p-1 border border-[#222]">
              <button 
                onClick={() => setBookingMode('transfer')}
                className={`flex-1 px-2 py-2 text-xs font-medium rounded shadow-sm cursor-pointer transition-colors ${bookingMode === 'transfer' ? 'bg-[#2a2a2a] text-accent' : 'text-text-muted hover:text-white'}`}>
                Transfer
              </button>
              <button 
                onClick={() => setBookingMode('hourly')}
                className={`flex-1 px-2 py-2 text-xs font-medium rounded shadow-sm cursor-pointer transition-colors ${bookingMode === 'hourly' ? 'bg-[#2a2a2a] text-accent' : 'text-text-muted hover:text-white'}`}>
                Na godziny
              </button>
              <button 
                onClick={() => setBookingMode('fullday')}
                className={`flex-1 px-2 py-2 text-xs font-medium rounded shadow-sm cursor-pointer transition-colors ${bookingMode === 'fullday' ? 'bg-[#2a2a2a] text-accent' : 'text-text-muted hover:text-white'}`}>
                Całodniowy
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-accent font-bold tracking-wider uppercase">Wybór auta do wyceny</label>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Wybierz pojazd do kalkulacji — niezależnie od podglądu floty po lewej.
            </p>
            <select
              value={bookingCarId}
              onChange={(e) => setBookingCarId(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors cursor-pointer"
            >
              {cars.map((fleet) => (
                <option key={fleet.id} value={fleet.id}>
                  {fleet.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-6">
            <AddressInput
              label="Odbiór"
              value={origin}
              onChange={setOrigin}
              placeholder="Np. Lotnisko Chopina, Warszawa"
              icon={MapPin}
              iconClassName="text-accent"
            />

            <AddressInput
              label="Cel"
              value={destination}
              onChange={setDestination}
              placeholder={bookingMode === 'transfer' ? "Np. Hotel Bristol, Warszawa" : "Opcjonalnie (do wyceny dystansu)"}
              icon={Navigation}
              iconClassName="text-text-muted"
            />

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-accent font-bold tracking-wider uppercase">Data</label>
                <input
                  type="date"
                  className="w-full bg-transparent border-b border-[#333] pb-2 text-sm text-white focus:outline-none focus:border-accent transition-colors [color-scheme:dark]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-accent font-bold tracking-wider uppercase">Godzina</label>
                <input
                  type="time"
                  className="w-full bg-transparent border-b border-[#333] pb-2 text-sm text-white focus:outline-none focus:border-accent transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            {bookingMode === 'hourly' && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-accent font-bold tracking-wider uppercase">Ilość godzin (min. 1)</label>
                <input
                  type="number"
                  min="1"
                  value={hours}
                  onChange={e => setHours(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full bg-transparent border-b border-[#333] pb-2 text-sm text-white focus:outline-none focus:border-accent transition-colors"
                />
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Cennik: 1. godz. 1400 PLN, każda kolejna +300 PLN. W cenie {Math.max(1, hours) * 20} km łącznie (20 km na każdą godzinę). Powyżej limitu: +10 PLN za km — podaj trasę w polu „Cel”, aby policzyć dystans. Usługa przewoźnika i kierowca są wliczone w podaną stawkę godzinową.
                </p>
              </div>
            )}

            {(bookingMode === 'hourly' || bookingMode === 'fullday') && (
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[10px] text-accent font-bold tracking-wider uppercase">Pakiety Dodatkowe</label>
                <div
                  onClick={() => setWeddingPackage(!weddingPackage)}
                  className={`p-3 border ${weddingPackage ? 'border-accent bg-[rgba(212,175,55,0.05)]' : 'border-[#333] bg-[#1a1a1a] hover:border-[#444]'} flex items-center gap-3 cursor-pointer rounded transition-all duration-300`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${weddingPackage ? 'bg-accent text-black' : 'border border-[#555] bg-transparent'}`}>
                    {weddingPackage && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Pakiet Ślubny</div>
                    <div className="text-xs text-text-muted mt-0.5">Dekoracja auta (+600 PLN)</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-8 border-t border-[#222] flex flex-col gap-5">
            {isCalculated ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="text-xs text-text-muted flex flex-col gap-2 bg-[#1a1a1a] p-4 rounded border border-[#222]">
                  <div className="flex justify-between items-center gap-4">
                    <span>Wybrane auto:</span>
                    <span className="text-white font-medium text-right">{bookingCar.name}</span>
                  </div>
                  <div className="w-full h-px bg-[#333] my-1"></div>
                  {bookingMode === 'hourly' && (
                    <div className="flex justify-between items-center gap-4">
                      <span>Limit km w cenie ({Math.max(1, hours)}h × 20 km):</span>
                      <span className="text-white font-medium shrink-0">{Math.max(1, hours) * 20} km</span>
                    </div>
                  )}
                  {bookingMode === 'fullday' && (
                    <div className="flex justify-between items-center gap-4">
                      <span>Limit km w cenie (pakiet całodniowy):</span>
                      <span className="text-white font-medium shrink-0">250 km</span>
                    </div>
                  )}
                  {((bookingMode === 'hourly' || bookingMode === 'fullday') && distance !== null && distance > 0) && (
                    <div className="w-full h-px bg-[#333] my-1"></div>
                  )}
                  {distance !== null && distance > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span>Szacowany dystans:</span>
                        <span className="text-white font-medium">{distance} km</span>
                      </div>
                      <div className="w-full h-px bg-[#333] my-1"></div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span>{baseText}:</span>
                    <span className="text-white">{baseCost} PLN</span>
                  </div>
                  {extraDist > 0 && (
                    <div className="flex justify-between items-center">
                      <span>{distanceText}:</span>
                      <span className="text-white">+{distCost} PLN</span>
                    </div>
                  )}
                  {(bookingMode === 'hourly' || bookingMode === 'fullday') && weddingPackage && (
                    <div className="flex justify-between items-center">
                      <span>Pakiet Ślubny:</span>
                      <span className="text-white">+600 PLN</span>
                    </div>
                  )}
                  <p className="text-[10px] text-text-muted leading-relaxed pt-1 border-t border-[#2a2a2a] mt-1">
                    Powyższa kwota szacunkowa uwzględnia przewóz z obsługą przewoźnika (kierowca, licencjonowany przewóz osób). Ewentualne dopłaty dotyczą wyłącznie nadwyżki kilometrów lub pakietów dodatkowych wskazanych w tabeli.
                  </p>
                </div>
                
                <div className="flex justify-between items-end px-1">
                  <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Szacowany Koszt</span>
                  <span className="text-3xl lg:text-4xl font-display font-bold text-accent">{total} PLN</span>
                </div>
                
                <button className="w-full bg-accent hover:bg-accent-hover text-black font-bold py-4 rounded text-sm tracking-widest uppercase transition-colors flex justify-center items-center gap-2 mt-2 cursor-pointer">
                  Rezerwuj Transfer
                </button>
              </motion.div>
            ) : (
              <button
                onClick={handleCalculate}
                disabled={isCalculating || !origin || (bookingMode === 'transfer' && !destination)}
                className="w-full bg-[#cda951] hover:bg-[#b5952f] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded text-sm tracking-widest uppercase transition-colors flex justify-center items-center gap-2 cursor-pointer"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Obliczanie...</span>
                  </>
                ) : (
                  'Wyceń Trasę'
                )}
              </button>
            )}

            <div className="text-center text-[10px] text-text-muted mt-2 tracking-wide leading-relaxed">
              {BRAND_NAME} — przewóz z przewoźnikiem w cenie • Wycena orientacyjna • Potwierdzenie po kontakcie
            </div>
          </div>
        </div>
      </section>

      {/* Individual quote CTA */}
      <section className="py-20 px-6 lg:px-12 bg-[#080808] border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-accent uppercase tracking-[4px] text-xs font-medium mb-4 block">Indywidualna wycena</span>
          <h2 className="font-display text-3xl lg:text-4xl mb-5">Potrzebujesz oferty szytej na miarę?</h2>
          <p className="text-text-muted text-sm lg:text-base leading-relaxed mb-10 max-w-2xl mx-auto">
            Planujesz nietypowy przejazd, trasę z wieloma przystankami albo sesję zdjęciową z autem w tle?
            Napisz lub zadzwoń — przygotujemy indywidualną wycenę dopasowaną do Twojego scenariusza. Każdą ofertę liczymy w oparciu o licencjonowany przewóz osób: przewoźnik, kierowca i bezpieczeństwo trasy są częścią kompletnej usługi, którą opisujemy wprost w kosztorysie.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="inline-flex items-center gap-3 px-8 py-4 border border-border rounded-sm hover:border-accent hover:bg-[rgba(212,175,55,0.06)] transition-colors text-white"
            >
              <Phone className="w-5 h-5 text-accent shrink-0" />
              <span className="text-left">
                <span className="block text-[10px] uppercase tracking-widest text-text-muted">Telefon</span>
                <span className="font-medium">+48 {CONTACT_PHONE_DISPLAY}</span>
              </span>
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-3 px-8 py-4 border border-border rounded-sm hover:border-accent hover:bg-[rgba(212,175,55,0.06)] transition-colors text-white"
            >
              <Mail className="w-5 h-5 text-accent shrink-0" />
              <span className="text-left">
                <span className="block text-[10px] uppercase tracking-widest text-text-muted">E-mail</span>
                <span className="font-medium break-all">{CONTACT_EMAIL}</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Mission & Commitment Section */}
      <section className="py-24 px-6 lg:px-12 bg-[#0a0a0a] border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl mb-4">Wybór Premium dla Wymagających</h2>
            <p className="text-text-muted max-w-2xl mx-auto text-sm lg:text-base leading-relaxed">
              <span className="text-white/90 font-medium">{BRAND_DISPLAY}</span> to firma z Białegostoku specjalizująca się w przewozie osób najwyższej klasy.
              Realizujemy transfery lotniskowe, wyjazdy biznesowe, śluby i przejazdy prywatne — zawsze w ramach usługi licencjonowanego przewoźnika, tak abyś wiedział, że w cenie masz nie tylko auto, ale także profesjonalnego kierowcę i zgodny z prawem przewóz pasażerski.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full border border-[#333] flex items-center justify-center mb-6 group-hover:border-accent transition-colors">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4">Nasza Misja</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Zapewniać spokojną, przejrzystą usługę: od pierwszego kontaktu wiesz, że współpracujesz z przewoźnikiem, który bierze pełną odpowiedzialność za przewóz. Dbamy o to, by każda podróż była komfortowa, bezpieczna i zgodna z najwyższymi standardami obsługi VIP.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full border border-[#333] flex items-center justify-center mb-6 group-hover:border-accent transition-colors">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4">Nasze Zobowiązanie</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Żadnych „dopłat za kierowcę” w ostatniej chwili — usługa przewoźnika jest integralną częścią wyceny. Jesteśmy dostępni, gdy planujesz trasę: od krótkiego transferu po całodniową dyspozycję, zawsze z jasnymi zasadami i licencjonowanym przewozem osób.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full border border-[#333] flex items-center justify-center mb-6 group-hover:border-accent transition-colors">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4">Nasza Flota</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Dobieramy auta pod charakter przejazdu: reprezentacyjną S-Klasę oraz charakterystyczną G-Klasę — zawsze w zestawie z doświadczonym kierowcą i pełną obsługą po stronie przewoźnika, tak abyś mógł skupić się na celu podróży, a nie na logistyce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 lg:px-12 bg-bg border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-accent uppercase tracking-[4px] text-xs font-medium mb-3 block">Doświadczenia</span>
              <h2 className="font-display text-3xl lg:text-4xl">Co Mówią Nasi Klienci</h2>
              <p className="text-text-muted text-sm mt-3 max-w-xl leading-relaxed">
                Poniżej opinie osób, które skorzystały z przewozów {BRAND_DISPLAY}. Wspólny mianownik: przejrzysta współpraca z przewoźnikiem i spokój, że cała usługa — włącznie z kierowcą — była jasno ujęta w ofercie.
              </p>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
              <span className="ml-3 text-sm text-text-muted font-medium">Średnia ocen 5.0/5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-surface p-8 border border-[#222] hover:border-accent/50 transition-colors flex flex-col h-full rounded-sm relative group"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-[#222] group-hover:text-accent/20 transition-colors" />
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-text-muted text-sm leading-relaxed mb-8 flex-1 italic">
                  "{testimonial.text}"
                </p>
                <div className="mt-auto pt-6 border-t border-[#222]">
                  <div className="font-bold text-white text-sm">{testimonial.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] py-12 px-6 lg:px-12 border-t border-[#222] text-center md:text-left">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="font-display text-xl font-bold tracking-[2px] text-accent mb-2">{BRAND_DISPLAY}</div>
            <div className="text-xs text-text-muted max-w-md">
              © 2026 {BRAND_NAME}. Wszelkie prawa zastrzeżone. Przewozy realizowane jako licencjonowany przewóz osób — przewoźnik w cenie usługi.
            </div>
          </div>
          <div className="flex gap-6 text-xs text-text-muted uppercase tracking-wider">
            <a href="#" className="hover:text-accent transition-colors">Regulamin</a>
            <a href="#" className="hover:text-accent transition-colors">Polityka Prywatności</a>
            <a href="#" className="hover:text-accent transition-colors">Kontakt</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

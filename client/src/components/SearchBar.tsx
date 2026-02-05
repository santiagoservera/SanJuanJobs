import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2, Briefcase } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useBuscarSugerencias } from "../modules/trabajos/hooks/useTrabajos";
import { useDebounce } from "@/shared/hooks/useDebounce";

interface SearchBarProps {
  onSearch?: (query: string, location: string) => void;
  className?: string;
  initialQuery?: string;
  initialLocation?: string;
}

export const SearchBar = ({
  onSearch,
  className = "",
  initialQuery = "",
  initialLocation = "",
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [sugerenciaSeleccionada, setSugerenciaSeleccionada] = useState(-1);
  const [userIsTyping, setUserIsTyping] = useState(false); // Nueva bandera

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce para evitar muchas peticiones
  const debouncedQuery = useDebounce(query, 300);

  // Obtener sugerencias solo si hay al menos 2 caracteres
  const { data: sugerencias, isLoading } = useBuscarSugerencias(
    debouncedQuery,
    debouncedQuery.length >= 2
  );

  // Actualizar estados cuando cambien los valores iniciales
  useEffect(() => {
    setQuery(initialQuery);
    setUserIsTyping(false); // Resetear cuando cambie desde afuera
  }, [initialQuery]);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSugerencias(false);
        setUserIsTyping(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mostrar sugerencias cuando haya resultados Y el usuario esté escribiendo
  useEffect(() => {
    if (
      userIsTyping &&
      sugerencias &&
      sugerencias.length > 0 &&
      query.length >= 2
    ) {
      setShowSugerencias(true);
      setSugerenciaSeleccionada(-1);
    } else if (!userIsTyping) {
      setShowSugerencias(false);
    }
  }, [sugerencias, query, userIsTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSugerencias(false);
    setUserIsTyping(false);
    onSearch?.(query, location);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setUserIsTyping(true); // Marcar que el usuario está escribiendo
    if (value.length >= 2) {
      setShowSugerencias(true);
    } else {
      setShowSugerencias(false);
    }
  };

  const handleSugerenciaClick = (sugerencia: string) => {
    setQuery(sugerencia);
    setShowSugerencias(false);
    setUserIsTyping(false); // Usuario dejó de escribir
    inputRef.current?.blur(); // Quitar el foco del input
    // Ejecutar la búsqueda automáticamente con la sugerencia seleccionada
    onSearch?.(sugerencia, location);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSugerencias || !sugerencias?.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSugerenciaSeleccionada((prev) =>
          prev < sugerencias.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSugerenciaSeleccionada((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        if (sugerenciaSeleccionada >= 0) {
          e.preventDefault();
          const sugerencia = sugerencias[sugerenciaSeleccionada];
          setQuery(sugerencia);
          setShowSugerencias(false);
          setUserIsTyping(false); // Usuario dejó de escribir
          inputRef.current?.blur(); // Quitar el foco del input
          // Ejecutar la búsqueda automáticamente
          onSearch?.(sugerencia, location);
        }
        break;
      case "Escape":
        setShowSugerencias(false);
        setUserIsTyping(false);
        setSugerenciaSeleccionada(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    if (query.length >= 2 && sugerencias?.length) {
      setUserIsTyping(true);
      setShowSugerencias(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="flex flex-col md:flex-row gap-3 p-4 bg-card rounded-2xl shadow-medium border border-border">
        {/* Campo de búsqueda con sugerencias */}
        <div className="relative flex-1" ref={wrapperRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="¿Qué trabajo buscás?"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            className="pl-12 h-12 border-0 bg-secondary/50 focus-visible:ring-1"
            autoComplete="off"
          />
          {isLoading && query.length >= 2 && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
          )}

          {/* Dropdown de sugerencias */}
          {showSugerencias && sugerencias && sugerencias.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg  max-h-[300px] overflow-y-auto z-[9999]">
              <div className="p-2">
                <p className="text-xs text-muted-foreground px-3 py-2">
                  Sugerencias de búsqueda
                </p>
                {sugerencias.map((sugerencia, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSugerenciaClick(sugerencia)}
                    onMouseEnter={() => setSugerenciaSeleccionada(index)}
                    className={`w-full text-left px-3 py-2.5 rounded-md transition-colors flex items-center gap-3 ${
                      index === sugerenciaSeleccionada
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <span className="text-sm truncate">{sugerencia}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Campo de ubicación */}
        <div className="relative flex-1 md:max-w-[200px]">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            disabled
            type="text"
            placeholder="San Juan"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-12 h-12 border-0 bg-secondary/50 focus-visible:ring-1 cursor-not-allowed"
          />
        </div>

        {/* Botón buscar */}
        <Button type="submit" variant="hero" size="lg" className="h-12 px-8">
          <Search className="w-5 h-5 mr-2" />
          Buscar
        </Button>
      </div>
    </form>
  );
};

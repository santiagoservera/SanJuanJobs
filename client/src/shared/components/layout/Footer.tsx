import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";
import logoBlanco from "@/assets/logoBlanco.png";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground ">
      <div className="container mx-auto py-12 ">
        <div className="grid grid-cols-1 md:grid-cols-3  mx-auto gap-8">
          {/* Links */}
          <div className="flex items-center flex-col">
            <h4 className="font-display font-semibold mb-4">Para Candidatos</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link
                  to="/empleos"
                  className="hover:text-primary transition-colors"
                >
                  Buscar Empleos
                </Link>
              </li>
              <li>
                <Link
                  to="/perfil"
                  className="hover:text-primary transition-colors"
                >
                  Mi Perfil
                </Link>
              </li>
              <li>
                <Link
                  to="/consejos"
                  className="hover:text-primary transition-colors"
                >
                  Consejos de CV
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center flex-col">
            <h4 className="font-display font-semibold mb-4">Para Empresas</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link
                  to="/publicar"
                  className="hover:text-primary transition-colors"
                >
                  Publicar Empleo
                </Link>
              </li>
              <li>
                <Link
                  to="/planes"
                  className="hover:text-primary transition-colors"
                >
                  Planes y Precios
                </Link>
              </li>
              <li>
                <Link
                  to="/empresas"
                  className="hover:text-primary transition-colors"
                >
                  Para Empresas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex items-center flex-col">
            <h4 className="font-display font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                San Juan, Argentina
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                hola@trabajolocal.com.ar
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                +54 264 576-2629
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="text-primary-foreground/70 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/70 hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-center text-sm text-primary-foreground/50">
          <p>© 2026 SanJuanJobs en San Juan, Argentina.</p>
        </div>
      </div>
    </footer>
  );
};

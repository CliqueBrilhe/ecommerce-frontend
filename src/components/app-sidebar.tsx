import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Sparkles, Package, Star } from "lucide-react";

type Categoria = {
  title: string;
  url: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const API_BASE = "https://ecommercebackend-production-d712.up.railway.app";
// se tiver prefixo global no Nest: `${API_BASE}/api/produtos/categorias`
const CATEGORIAS_URL = `${API_BASE}/produtos/categorias`;

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

    useEffect(() => {
      async function fetchCategorias() {
        setLoading(true);
        setError(null);

        const base: Categoria[] = [
          { title: "Todos os Produtos", url: "/", icon: Package },
          { title: "Ofertas", url: "/categoria/ofertas", icon: Star },
        ];

        try {
          const resp = await axios.get(CATEGORIAS_URL);
          const data = resp.data;

          console.log("[API] /produtos/categorias =>", data);

          // 1) Garante array
          const arr = Array.isArray(data) ? data : [];

          // 2) Converte somente strings; tudo que NÃO é string vira '' e será filtrado
          const seguras = arr
            .map((x) => (typeof x === "string" ? x : ""))
            .map((x) => x.trim())
            .filter((x) => x.length > 0);

          // 3) Monta itens
          const lista: Categoria[] = seguras.map((nome) => ({
            title: nome,
            url: "/categoria/" + encodeURIComponent(nome),
            icon: Star,
          }));

          // 4) Valida (logando itens ruins, se houver)
          const invalidos = lista.filter(
            (c) => !c || !c.title || !c.url
          );
          if (invalidos.length) {
            console.warn("[Categorias inválidas removidas]", invalidos);
          }

          const validos = lista.filter((c) => c && c.title && c.url);

          setCategories([...base, ...validos]);
        } catch (e) {
          console.error("Erro ao buscar categorias:", e);
          setError("Não foi possível carregar as categorias.");
          setCategories(base);
        } finally {
          setLoading(false);
        }
      }

      fetchCategorias();
    }, []);


  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-lg text-primary">Click&Brilhe</h2>
                <p className="text-xs text-muted-foreground">Produtos de beleza</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-0">
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {!collapsed && "Categorias"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {loading && (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Carregando...
                </div>
              )}

              {error && (
                <div className="px-4 py-2 text-sm text-destructive">{error}</div>
              )}
              {!loading &&
                categories
                  .filter((c) => c && c.title && c.url) // guarda extra no render
                  .map((category) => {
                    const Icon = category.icon ?? Package;
                    return (
                      <SidebarMenuItem key={category.title}>
                        <SidebarMenuButton asChild className="h-12">
                          <NavLink
                            to={category.url}
                            end
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${getNavCls(
                                { isActive }
                              )}`
                            }
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && (
                              <span className="text-sm font-medium">
                                {category.title}
                              </span>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

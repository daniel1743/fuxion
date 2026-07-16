import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Info, MessageCircle, HelpCircle, Package, Dumbbell } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import fuxionDatabase from '@/data/fuxion_database.json';

export function GlobalCommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Escuchar el atajo ⌘K o Ctrl+K
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    // Escuchar el evento global customizado para abrir por toque
    const handleOpenCommand = () => setOpen(true);
    window.addEventListener('fuxion:open-command-palette', handleOpenCommand);
    return () => window.removeEventListener('fuxion:open-command-palette', handleOpenCommand);
  }, []);

  useEffect(() => {
    // Cargar productos para sugerencias usando la db local
    if (fuxionDatabase && fuxionDatabase.productos) {
      const productsArray = Object.entries(fuxionDatabase.productos).map(([id, data]) => ({
        id,
        ...data
      }));
      setProducts(productsArray.slice(0, 5));
    }
  }, []);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Escribe un comando o busca un producto..." />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        
        <CommandGroup heading="Navegación Rápida">
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <Search className="mr-2 h-4 w-4" />
            <span>Catálogo Principal</span>
            <CommandShortcut>G C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/carrito'))}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Ver Carrito</span>
            <CommandShortcut>G B</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/ayuda'))}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Centro de Ayuda</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/contacto'))}>
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Contactar Asesor</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Productos Destacados">
          {products.slice(0, 5).map(product => (
            <CommandItem 
              key={product.id}
              onSelect={() => runCommand(() => navigate(`/?search=${encodeURIComponent(product.name)}`))}
            >
              <Package className="mr-2 h-4 w-4 text-fuxion" />
              <span>{product.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

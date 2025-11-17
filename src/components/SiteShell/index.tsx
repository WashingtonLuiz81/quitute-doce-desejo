"use client";

import React from "react";
import Header from "../Header";
import CartDrawer from "../CartDrawer";
import Footer from "../Footer";
import { useCartStore } from "@/store/useCartStore";
import { useCartDrawerStore } from "@/store/useCartDrawerStore";

// Simulação de usuário (ainda sem login real)
const mockUser = {
  name: "Jessica Jones",
  email: "jessica@example.com",
  image: "", // Exemplo: "https://i.pravatar.cc/150?img=3"
};

type Props = {
  children: React.ReactNode;
};

const SiteShell: React.FC<Props> = ({ children }) => {
  // total de itens no carrinho
  const cartCount = useCartStore((s) =>
    s.items.reduce((acc, item) => acc + item.qty, 0)
  );

  // controle do Drawer via Zustand
  const { isOpen, open, close, toggle } = useCartDrawerStore();

  return (
    <>
      <Header
        cartCount={cartCount}
        onCartClick={toggle}
        user={null /* ou mockUser para simular logado */}
      />
      <CartDrawer open={isOpen} onClose={close} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default SiteShell;

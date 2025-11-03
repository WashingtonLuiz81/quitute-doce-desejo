"use client";

import React, { useState } from "react";
import Header from "../Header";
import CartDrawer from "../CartDrawer";
import Footer from "../Footer";

// simulação de usuário
const mockUser = {
  name: "Jessica Jones",
  email: "jessica@example.com",
  image: "", // coloca uma url para testar com foto
  // image: "https://i.pravatar.cc/150?img=3",
};

type Props = {
  children: React.ReactNode;
};

const SiteShell: React.FC<Props> = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Header
        cartCount={3}
        onCartClick={() => setCartOpen(true)}
        user={null}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default SiteShell;

 import { useState, useEffect } from "react";
 import { User, Session } from "@supabase/supabase-js";
 import { supabase } from "@/lib/supabase";
 
 export function useAuth() {
   const [user, setUser] = useState<User | null>(null);
   const [session, setSession] = useState<Session | null>(null);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     // Configurar listener de mudanças de autenticação
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       (event, session) => {
         setSession(session);
         setUser(session?.user ?? null);
         setLoading(false);
       }
     );
 
     // Verificar sessão existente
     supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
       setUser(session?.user ?? null);
       setLoading(false);
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   const signIn = async (email: string, password: string) => {
     const { error } = await supabase.auth.signInWithPassword({
       email,
       password,
     });
     return { error };
   };
 
   const signUp = async (email: string, password: string, fullName?: string) => {
     const redirectUrl = `${window.location.origin}/`;
     
     const { data, error } = await supabase.auth.signUp({
       email,
       password,
       options: {
         emailRedirectTo: redirectUrl,
         data: {
           full_name: fullName,
         },
       },
     });
 
     // Criar perfil do usuário se o signup foi bem-sucedido
     if (data.user && !error) {
       const { error: profileError } = await supabase
         .from("profiles")
         .insert({
           id: data.user.id,
           full_name: fullName || "",
         });
       
       if (profileError) {
         console.error("Erro ao criar perfil:", profileError);
       }
     }
 
     return { data, error };
   };
 
   const signOut = async () => {
     const { error } = await supabase.auth.signOut();
     return { error };
   };
 
   return {
     user,
     session,
     loading,
     signIn,
     signUp,
     signOut,
   };
 }
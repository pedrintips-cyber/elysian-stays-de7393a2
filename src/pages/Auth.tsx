 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { useAuth } from "@/hooks/useAuth";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { useToast } from "@/hooks/use-toast";
 import { Loader2 } from "lucide-react";
 
 export default function Auth() {
   const [isLogin, setIsLogin] = useState(true);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [fullName, setFullName] = useState("");
   const [loading, setLoading] = useState(false);
   const { signIn, signUp } = useAuth();
   const navigate = useNavigate();
   const { toast } = useToast();
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
 
     try {
       if (isLogin) {
         const { error } = await signIn(email, password);
         if (error) {
           toast({
             variant: "destructive",
             title: "Erro ao fazer login",
             description: error.message,
           });
         } else {
           toast({
             title: "Login realizado!",
             description: "Bem-vindo de volta",
           });
           navigate("/");
         }
       } else {
         const { error } = await signUp(email, password, fullName);
         if (error) {
           toast({
             variant: "destructive",
             title: "Erro ao criar conta",
             description: error.message,
           });
         } else {
           toast({
             title: "Conta criada!",
             description: "Você já pode fazer login",
           });
           setIsLogin(true);
         }
       }
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface to-muted p-4">
       <Card className="w-full max-w-md shadow-soft">
         <CardHeader className="space-y-1">
           <CardTitle className="text-2xl font-bold text-center">
             {isLogin ? "Entrar" : "Criar conta"}
           </CardTitle>
           <CardDescription className="text-center">
             {isLogin
               ? "Entre com suas credenciais"
               : "Preencha os dados para criar sua conta"}
           </CardDescription>
         </CardHeader>
         <CardContent>
           <form onSubmit={handleSubmit} className="space-y-4">
             {!isLogin && (
               <div className="space-y-2">
                 <Label htmlFor="fullName">Nome completo</Label>
                 <Input
                   id="fullName"
                   type="text"
                   placeholder="Seu nome"
                   value={fullName}
                   onChange={(e) => setFullName(e.target.value)}
                   required={!isLogin}
                   disabled={loading}
                 />
               </div>
             )}
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <Input
                 id="email"
                 type="email"
                 placeholder="seu@email.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 disabled={loading}
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="password">Senha</Label>
               <Input
                 id="password"
                 type="password"
                 placeholder="••••••••"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 disabled={loading}
               />
             </div>
             <Button
               type="submit"
               className="w-full"
               disabled={loading}
             >
               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {isLogin ? "Entrar" : "Criar conta"}
             </Button>
           </form>
           <div className="mt-4 text-center text-sm">
             <button
               type="button"
               onClick={() => setIsLogin(!isLogin)}
               className="text-primary hover:underline"
               disabled={loading}
             >
               {isLogin
                 ? "Não tem conta? Criar conta"
                 : "Já tem conta? Fazer login"}
             </button>
           </div>
         </CardContent>
       </Card>
     </div>
   );
 }
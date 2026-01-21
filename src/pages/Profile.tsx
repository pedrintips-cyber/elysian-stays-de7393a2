 import { useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import { useAuth } from "@/hooks/useAuth";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Avatar, AvatarFallback } from "@/components/ui/avatar";
 import { LogOut, User } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 
 export default function Profile() {
   const { user, loading, signOut } = useAuth();
   const navigate = useNavigate();
   const { toast } = useToast();
 
   useEffect(() => {
     if (!loading && !user) {
       navigate("/auth");
     }
   }, [user, loading, navigate]);
 
   const handleSignOut = async () => {
     const { error } = await signOut();
     if (error) {
       toast({
         variant: "destructive",
         title: "Erro ao sair",
         description: error.message,
       });
     } else {
       toast({
         title: "Você saiu",
         description: "Até logo!",
       });
       navigate("/");
     }
   };
 
   if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="text-muted-foreground">Carregando...</div>
       </div>
     );
   }
 
   if (!user) {
     return null;
   }
 
   const initials = user.email
     ?.split("@")[0]
     .substring(0, 2)
     .toUpperCase() || "U";
 
   return (
     <div className="min-h-screen bg-gradient-to-br from-background via-surface to-muted pb-24 pt-8 px-4">
       <div className="max-w-md mx-auto">
         <Card className="shadow-soft">
           <CardHeader className="text-center pb-4">
             <div className="flex justify-center mb-4">
               <Avatar className="h-24 w-24">
                 <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                   {initials}
                 </AvatarFallback>
               </Avatar>
             </div>
             <CardTitle className="text-2xl">Meu Perfil</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="space-y-2">
               <div className="text-sm text-muted-foreground">Email</div>
               <div className="text-base font-medium">{user.email}</div>
             </div>
 
             <div className="pt-4">
               <Button
                 onClick={handleSignOut}
                 variant="outline"
                 className="w-full"
               >
                 <LogOut className="mr-2 h-4 w-4" />
                 Sair da conta
               </Button>
             </div>
           </CardContent>
         </Card>
 
         <div className="mt-6 text-center">
           <Button
             onClick={() => navigate("/")}
             variant="ghost"
           >
             Voltar ao início
           </Button>
         </div>
       </div>
     </div>
   );
 }
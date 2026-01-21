 import { useParams, useNavigate } from "react-router-dom";
 import { useEffect, useState } from "react";
 import { supabase } from "@/lib/supabase";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { ArrowLeft, Heart, Star, Users, Bed, Bath } from "lucide-react";
 import { useAuth } from "@/hooks/useAuth";
 import { useToast } from "@/hooks/use-toast";
 
 interface Property {
   id: string;
   title: string;
   city: string;
   price_per_night: number;
   rating: number;
   image_url: string;
   description: string;
   bedrooms: number;
   bathrooms: number;
   guests: number;
   amenities: string[];
 }
 
 export default function PropertyDetail() {
   const { id } = useParams();
   const navigate = useNavigate();
   const { user } = useAuth();
   const { toast } = useToast();
   const [property, setProperty] = useState<Property | null>(null);
   const [loading, setLoading] = useState(true);
   const [isFavorite, setIsFavorite] = useState(false);
 
   useEffect(() => {
     if (id) {
       fetchProperty();
       if (user) {
         checkFavorite();
       }
     }
   }, [id, user]);
 
   const fetchProperty = async () => {
     const { data, error } = await supabase
       .from("properties")
       .select("*")
       .eq("id", id)
       .single();
 
     if (error) {
       console.error("Erro ao buscar propriedade:", error);
       toast({
         variant: "destructive",
         title: "Erro",
         description: "Não foi possível carregar os detalhes da propriedade",
       });
     } else {
       setProperty(data);
     }
     setLoading(false);
   };
 
   const checkFavorite = async () => {
     if (!user) return;
 
     const { data } = await supabase
       .from("favorites")
       .select("id")
       .eq("user_id", user.id)
       .eq("property_id", id)
       .maybeSingle();
 
     setIsFavorite(!!data);
   };
 
   const toggleFavorite = async () => {
     if (!user) {
       toast({
         variant: "destructive",
         title: "Login necessário",
         description: "Faça login para adicionar favoritos",
       });
       navigate("/auth");
       return;
     }
 
     if (isFavorite) {
       await supabase
         .from("favorites")
         .delete()
         .eq("user_id", user.id)
         .eq("property_id", id);
       setIsFavorite(false);
       toast({
         title: "Removido dos favoritos",
       });
     } else {
       await supabase
         .from("favorites")
         .insert({
           user_id: user.id,
           property_id: id,
         });
       setIsFavorite(true);
       toast({
         title: "Adicionado aos favoritos",
       });
     }
   };
 
   if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="text-muted-foreground">Carregando...</div>
       </div>
     );
   }
 
   if (!property) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="text-center">
           <p className="text-muted-foreground mb-4">Propriedade não encontrada</p>
           <Button onClick={() => navigate("/")}>Voltar</Button>
         </div>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-background pb-24">
       <div className="relative">
         <img
           src={property.image_url}
           alt={property.title}
           className="w-full h-[400px] object-cover"
         />
         <Button
           onClick={() => navigate(-1)}
           variant="ghost"
           size="icon"
           className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white"
         >
           <ArrowLeft className="h-5 w-5" />
         </Button>
         <Button
           onClick={toggleFavorite}
           variant="ghost"
           size="icon"
           className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white"
         >
           <Heart
             className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`}
           />
         </Button>
       </div>
 
       <div className="max-w-4xl mx-auto px-4 py-6">
         <div className="mb-4">
           <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
           <div className="flex items-center gap-4 text-sm text-muted-foreground">
             <div className="flex items-center gap-1">
               <Star className="h-4 w-4 fill-primary text-primary" />
               <span className="font-medium">{property.rating}</span>
             </div>
             <span>•</span>
             <span>{property.city}</span>
           </div>
         </div>
 
         <div className="flex gap-6 mb-6 text-sm">
           <div className="flex items-center gap-2">
             <Users className="h-5 w-5 text-muted-foreground" />
             <span>{property.guests} hóspedes</span>
           </div>
           <div className="flex items-center gap-2">
             <Bed className="h-5 w-5 text-muted-foreground" />
             <span>{property.bedrooms} quartos</span>
           </div>
           <div className="flex items-center gap-2">
             <Bath className="h-5 w-5 text-muted-foreground" />
             <span>{property.bathrooms} banheiros</span>
           </div>
         </div>
 
         <div className="border-t border-b py-6 mb-6">
           <p className="text-muted-foreground">{property.description}</p>
         </div>
 
         <div className="mb-6">
           <h2 className="text-xl font-semibold mb-3">Comodidades</h2>
           <div className="flex flex-wrap gap-2">
             {property.amenities.map((amenity, index) => (
               <Badge key={index} variant="secondary">
                 {amenity}
               </Badge>
             ))}
           </div>
         </div>
 
         <div className="sticky bottom-20 bg-white border-t shadow-soft p-4 rounded-t-3xl">
           <div className="flex items-center justify-between">
             <div>
               <span className="text-2xl font-bold">
                 R$ {property.price_per_night.toFixed(0)}
               </span>
               <span className="text-sm text-muted-foreground"> / noite</span>
             </div>
             <Button size="lg" className="rounded-2xl">
               Reservar
             </Button>
           </div>
         </div>
       </div>
     </div>
   );
 }
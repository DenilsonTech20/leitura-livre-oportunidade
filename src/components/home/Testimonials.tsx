
import React from "react";
import { Star, Quote } from "lucide-react";

interface TestimonialProps {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  delay?: number;
}

const Testimonial = ({ quote, name, role, avatar, rating, delay = 0 }: TestimonialProps) => (
  <div 
    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="mb-4 flex">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
            }`}
          />
        ))}
    </div>
    <div className="flex-grow">
      <Quote className="h-6 w-6 text-primary/40 mb-3" />
      <p className="text-muted-foreground mb-6">{quote}</p>
    </div>
    <div className="flex items-center mt-4">
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-full object-cover mr-4"
      />
      <div>
        <h4 className="font-medium">{name}</h4>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const testimonials: TestimonialProps[] = [
    {
      quote: "Essa plataforma mudou minha relação com a leitura. Consigo alternar facilmente entre o e-book e o audiolivro do mesmo título, dependendo se estou em casa ou no trânsito.",
      name: "Ana Silva",
      role: "Professora",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
    },
    {
      quote: "A qualidade dos audiolivros é surpreendente. As narrações são cativantes e a interface é muito intuitiva. Sem dúvida, vale cada centavo da assinatura.",
      name: "Carlos Mendes",
      role: "Engenheiro",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg",
      rating: 5,
    },
    {
      quote: "Adoro a possibilidade de baixar os livros para ler offline. Perfeito para minhas viagens onde nem sempre tenho acesso à internet.",
      name: "Juliana Costa",
      role: "Designer",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      rating: 4,
    },
    {
      quote: "O sistema de recomendações é impressionante. Descobri vários autores brasileiros que não conhecia e agora são meus favoritos.",
      name: "Ricardo Oliveira",
      role: "Advogado",
      avatar: "https://randomuser.me/api/portraits/men/29.jpg",
      rating: 5,
    },
    {
      quote: "A variedade de títulos em português é o que me conquistou. Finalmente uma plataforma que valoriza nossa literatura!",
      name: "Fernanda Lima",
      role: "Jornalista",
      avatar: "https://randomuser.me/api/portraits/women/24.jpg",
      rating: 5,
    },
    {
      quote: "A interface é limpa e intuitiva. Consigo encontrar facilmente novos livros para ler e o processo de empréstimo é super simples.",
      name: "Marcelo Santos",
      role: "Desenvolvedor",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      rating: 4,
    },
  ];

  return (
    <section className="py-20 md:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full mb-4">
            O que dizem nossos leitores
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Experiências de <span className="text-gradient">leitores satisfeitos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Veja o que nossos usuários estão dizendo sobre suas experiências com a Leitura Livre. Junte-se a milhares de leitores apaixonados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial 
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              role={testimonial.role}
              avatar={testimonial.avatar}
              rating={testimonial.rating}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

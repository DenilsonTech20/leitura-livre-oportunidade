
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Clock, Settings, BookOpenText, LogOut } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const location = useLocation();
  
  // Mock user data (would come from context/state in real app)
  const user = {
    name: "Maria Silva",
    email: "maria@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  };
  
  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "Emprestados", href: "/dashboard/emprestados" },
    { icon: Clock, label: "Histórico", href: "/dashboard/historico" },
    { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
  ];
  
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2 text-primary font-semibold text-lg">
              <BookOpenText className="h-6 w-6" />
              <span className="font-heading">Leitura Livre</span>
            </Link>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <CustomButton
              variant="outline"
              className="w-full justify-start text-red-600"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sair
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2 text-primary font-semibold text-lg">
          <BookOpenText className="h-6 w-6" />
          <span className="font-heading">Leitura Livre</span>
        </Link>
        <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none">
          <span className="sr-only">Abrir menu</span>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 py-6 px-4 sm:px-6 md:py-8 md:px-8">
          <div className="pb-8 border-b border-gray-200">
            <div className="flex items-center">
              <img
                className="h-12 w-12 rounded-full"
                src={user.avatar}
                alt={user.name}
              />
              <div className="ml-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Bem-vindo(a), {user.name}
                </h1>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary/10 rounded-md p-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Livros emprestados
                      </dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">3</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/dashboard/emprestados"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Ver todos
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Livros lidos
                      </dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">12</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/dashboard/historico"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Ver histórico
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tempo total de leitura
                      </dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">37h 45min</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/dashboard/estatisticas"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Ver estatísticas
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent books */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Atividade recente
            </h2>
            <div className="mt-4 bg-white shadow rounded-lg">
              <div className="p-6">
                <ul className="divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-10 object-cover rounded"
                          src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          alt="O Alquimista"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          O Alquimista
                        </p>
                        <p className="text-sm text-gray-500">Paulo Coelho</p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Emprestado
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-10 object-cover rounded"
                          src="https://images.unsplash.com/photo-1531928351158-2f736078e0a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          alt="A Revolução dos Bichos"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          A Revolução dos Bichos
                        </p>
                        <p className="text-sm text-gray-500">George Orwell</p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Devolvido
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-10 object-cover rounded"
                          src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          alt="Dom Casmurro"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Dom Casmurro
                        </p>
                        <p className="text-sm text-gray-500">Machado de Assis</p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Em progresso
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

import { createBrowserRouter } from "react-router-dom";
import Root from "../Pages/Root";
import HomePage from "../Pages/Home";

// Usuários
import Users_Index from "../Pages/Users/Index";
import Users_Form from "../Pages/Users/Form";

// Unidades Federativas
import FederativeUnits_Index from "../Pages/FederativeUnits/Index";
import FederativeUnits_Form from "../Pages/FederativeUnits/Form";

// Cidades
import Cities_IndexPage from "../Pages/Cities/Index";
import Cities_FormPage from "../Pages/Cities/Form";

// Cargos
import Jobs_IndexPage from "../Pages/Jobs/Index";
import Jobs_FormPage from "../Pages/Jobs/Form";

// Viagens
import Travels_IndexPage from "../Pages/Travels/Index";
import Travels_FormPage from "../Pages/Travels/Form";
import Travels_ViewPage from "../Pages/Travels/View";

export const PrivateRoutes = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },

      // Usuários ----------------------------------------------------
      {
        path: "/usuarios",
        element: <Users_Index />,
      },
      {
        path: "/usuarios/novo",
        element: <Users_Form />,
      },
      {
        path: "/usuarios/editar/:identifier",
        element: <Users_Form />,
      },

      // Unidades Federativas --------------------------------------------
      {
        path: "/unidades-federativas",
        element: <FederativeUnits_Index />,
      },
      // {
      //     path: "/unidades-federativas/novo",
      //     element: <FederativeUnits_Form />
      // },
      {
        path: "/unidades-federativas/editar/:identifier",
        element: <FederativeUnits_Form />,
      },

      // Cidades ---------------------------------------------------------
      {
        path: "/cidades",
        element: <Cities_IndexPage />,
      },
      // {
      //     path: "/cidades/novo",
      //     element: <Cities_FormPage />
      // },
      {
        path: "/cidades/editar/:identifier",
        element: <Cities_FormPage />,
      },

      // Cargos ---------------------------------------------------------
      {
        path: "/cargos",
        element: <Jobs_IndexPage />,
      },
      {
        path: "/cargos/novo",
        element: <Jobs_FormPage />,
      },
      {
        path: "/cargos/editar/:identifier",
        element: <Jobs_FormPage />,
      },

      // Viagens ---------------------------------------------------------
      {
        path: "/viagens",
        element: <Travels_IndexPage />,
      },
      {
        path: "/viagens/novo",
        element: <Travels_FormPage />,
      },
      {
        path: "/viagens/editar/:identifier",
        element: <Travels_FormPage />,
      },
      {
        path: "/viagens/visualizar/:identifier",
        element: <Travels_ViewPage />,
      },
    ],
  },
]);

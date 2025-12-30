import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Main from "../pages/Main";
import Project1 from "../pages/Project1";
import Project2 from "../pages/Project2";
import Project3 from "../pages/Project3";
import Project4 from "../pages/Project4";
import Project5 from "../pages/Project5";
import Project6 from "../pages/Project6";

import PageTransition from "../components/PageTransition";

export default function Router({
  theme,
  toggleTheme,
  active,
  setActive,
  revealKey,
  onRequestQuote,
  isQuoteOpen,
}) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Main
                theme={theme}
                toggleTheme={toggleTheme}
                active={active}
                setActive={setActive}
                revealKey={revealKey}
                onRequestQuote={onRequestQuote}
                isQuoteOpen={isQuoteOpen}
              />
            </PageTransition>
          }
        />

        <Route
          path="/projects/1"
          element={
            <PageTransition>
              <Project1 theme={theme} />
            </PageTransition>
          }
        />

        <Route
          path="/projects/2"
          element={
            <PageTransition>
              <Project2 theme={theme} />
            </PageTransition>
          }
        />

        <Route
          path="/projects/3"
          element={
            <PageTransition>
              <Project3 theme={theme} />
            </PageTransition>
          }
        />

        <Route
          path="/projects/4"
          element={
            <PageTransition>
              <Project4 theme={theme} />
            </PageTransition>
          }
        />

        <Route
          path="/projects/5"
          element={
            <PageTransition>
              <Project5 theme={theme} />
            </PageTransition>
          }
        />

        <Route
          path="/projects/6"
          element={
            <PageTransition>
              <Project6 theme={theme} />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

import './Home.css';

export const Home = () => {
  return (
    <div className="page-container">
      <header className="home-header">
        <h1>🎲 Platonic Dice</h1>
        <p>Interactive showcase for the platonic-dice packages</p>
      </header>

      <main className="home-main">
        <section className="info-section">
          <p>
            Explore the full capabilities of the platonic-dice packages using the navigation above.
          </p>
        </section>
      </main>
    </div>
  );
};

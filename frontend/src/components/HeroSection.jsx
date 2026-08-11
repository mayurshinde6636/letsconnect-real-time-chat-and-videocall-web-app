import "../styles/HeroSection.css";

function HeroSection() {
  return (
    <section className="heroSection">

      <div className="leftSection">

        <h1>
          <span>Connect</span> with your loved Ones
        </h1>

        <p>
          Cover a distance by Apna Video Call
        </p>

        <button>
          Get Started
        </button>

      </div>

      <div className="rightSection">

        <img
          src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=700"
          alt="Video Call"
        />

      </div>

    </section>
  );
}

export default HeroSection;
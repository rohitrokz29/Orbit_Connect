import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import Image from "../assets/images/video.jpg";
import GlobeImage from "../assets/images/globe.jpeg";
import ConnectionImage from "../assets/images/securecon.jpeg";
import MessageImage from "../assets/images/livemessage.jpeg";
import DataImage from "../assets/images/dataSec.jpeg";

const Main = () => {
  const { user, isSignedIn } = useContext(UserContext);

  const features = [
    { name: "Connect Globally", image: GlobeImage },
    { name: "Secure Connection", image: ConnectionImage },
    { name: "Live Messaging", image: MessageImage },
    { name: "Data Security", image: DataImage },
  ];

  return (
    <>
      <main className="hero mb-2" id="main">
        <div className="columns">
          <div className="column">
            <section className="section is-medium">
              <h1 className="title is-size-1">
                <Link to={"/"} className="brand">Orbit Connect</Link>
              </h1>
              <h2 className="subtitle pt-2">
                Stay connected and collaborate with friends, family and colleagues no matter where you are.
              </h2>
            </section>
            <div className="is-flex is-flex-direction-row	is-justify-content-space-around">
              <div className="buttons">
                <Link to="/signup"> <button className="button is-medium is-success px-6 is-focused is-size-5-mobile" >Get Started</button></Link>
                <Link to="/signin">< button className="button is-medium is-info px-6 is-focused is-size-5-mobile">Already a user</button></Link>
              </div>
            </div>


          </div>
          <div className="column ">
            <SideImage />
          </div>
        </div>
        <div className="is-flex is-flex-wrap-wrap	is-justify-content-space-between	 mt-3 ">
          {features.map((property) => {
            return (
              <Card key={property.name} name={property.name} image={property.image} />
            );
          })}
        </div>

      </main>
      <footer className="footer">
        <div className="content has-text-centered">
          <Link to="/"><strong>Orbit Connect</strong></Link> is an MIT licenced web application on <Link target={"_blank"} to="www.github.com" >Github</Link>.

        </div>
      </footer>
    </>
  );
};
export default Main;

export const SideImage = () => {
  return (
    <figure className="box my-4 mx-6"  >
      <img className="image is-3by2"  src={Image} />
    </figure>
  );
};

export const Card = ({ name, image }) => {
  return (
    <div className="column">

      <div className="  card mx-6">
        <div className="card-image">
          <img
            className="image is-3by2"
            height={200}
            width={300}
            src={image}
            alt="IMG"
          />
        </div>
        <div className="card-content">
          <div className="media-content">
            <p className="title is-5 is-size-6-mobile" >{name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

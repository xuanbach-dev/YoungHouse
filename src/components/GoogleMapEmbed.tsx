import React from 'react';
import './GoogleMapEmbed.css';

interface GoogleMapEmbedProps {
  branchId: number;
  branchName: string;
  address?: string;
  className?: string;
}

const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({ 
  branchId, 
  branchName, 
  address, 
  className = '' 
}) => {
  // Map URLs for each Young House branch
  const getMapUrl = (branchId: number): string => {
    switch (branchId) {
      case 1:
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7448.332439327077!2d105.5421380901638!3d21.026034137009436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b007db6ca61%3A0x1a71381f66c28851!2zTmjDoCB0cuG7jSBZb3VuZyBIb3VzZSAx!5e0!3m2!1svi!2s!4v1758164280803!5m2!1svi!2s";
      case 2:
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1438466775544!2d105.53127747471441!3d21.026929587842577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b0036d73f29%3A0xa318506797a97624!2sYoung%20House%202!5e0!3m2!1svi!2s!4v1758164303654!5m2!1svi!2s";
      case 4:
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.3812917275845!2d105.54630277471405!3d21.017424288168876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b41e87c01f3%3A0xd0059f09a8791280!2zTmjDoCBUcuG7jSBZb3VuZyBIb3VzZSA0!5e0!3m2!1svi!2s!4v1758164321713!5m2!1svi!2s";
      case 5:
      
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1862.1759625870004!2d105.54905839839479!3d21.0186001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b0062f1995f%3A0x89ab20614a29c8c2!2sYoung%20House%205!5e0!3m2!1svi!2sus!4v1758166455214!5m2!1svi!2sus";
     
     case 6:
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d931.0242462886803!2d105.52869186453995!3d21.028805043814263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b005104fa6d%3A0x4eb17d2609273518!2zxJDhu6ljIFRow6BuaCBCdWlsZGluZw!5e0!3m2!1sen!2s!4v1759410345316!5m2!1sen!2s";
        case 7:
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d232.76905804091237!2d105.55109415203336!3d21.020481670013293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345bd1ca96550f%3A0xba9059ecf0b7745b!2zTmjDoCB0cuG7jSBIw6AgTuG7mWkgMw!5e0!3m2!1svi!2sus!4v1758166537085!5m2!1svi!2sus";
      case 8:
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d232.76976362544352!2d105.55511007479933!3d21.0200297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b5ddf893bd3%3A0xc7e243a204cc7516!2sYoung%20House%208!5e0!3m2!1svi!2sus!4v1758166553964!5m2!1svi!2sus";
      case 9:
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0165536995232!2d105.5342971775014!3d21.03202363771539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b004daca07f%3A0x9e2ef761ed902060!2sYoung%20House%209!5e0!3m2!1svi!2sus!4v1758166580117!5m2!1svi!2sus";
      case 10:
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d261.25750356716327!2d105.53465735357587!3d21.0301430930058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345bda16aedb85%3A0x1540b18e63fbb005!2zTmjDoCBWxINuIEhvw6EgVGjDtG4gVGjDoWkgQsOsbmg!5e0!3m2!1svi!2sus!4v1758166694364!5m2!1svi!2sus";
      case 11:
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1441077763166!2d105.52030507750031!3d21.02691913790054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345bf0065e45e3%3A0x3cbb1cc56db7a6bb!2zTmjDoCBUcuG7jSBIw6AgVGjDoG5o!5e0!3m2!1svi!2sus!4v1758166720734!5m2!1svi!2sus";
      case 12:
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d465.5227655477494!2d105.5350341290614!3d21.025397548367835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345bdaaab0bafd%3A0xd89262a66fc74d3b!2zTmjDoCBUaOG7nSBQaMO6IEjhu691!5e0!3m2!1svi!2sus!4v1758166756364!5m2!1svi!2sus";
      case 14:
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d465.5227655477494!2d105.5350341290614!3d21.025397548367835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345bdaaab0bafd%3A0xd89262a66fc74d3b!2zTmjDoCBUaOG7nSBQaMO6IEjhu691!5e0!3m2!1svi!2sus!4v1758166756364!5m2!1svi!2sus";
      default:
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7448.332439327077!2d105.5421380901638!3d21.026034137009436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b007db6ca61%3A0x1a71381f66c28851!2zTmjDoCB0cuG7jSBZb3VuZyBIb3VzZSAx!5e0!3m2!1svi!2s!4v1758164280803!5m2!1svi!2s";
    }
  };

  const mapUrl = getMapUrl(branchId);

  return (
    <div className={`google-map-embed ${className}`}>
      <div className="map-header">
        <h3>{branchName}</h3>
        {address && <p className="map-address">{address}</p>}
      </div>
      <div className="map-container">
        <iframe
          src={mapUrl}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Bản đồ ${branchName}`}
        />
      </div>
    </div>
  );
};

export default GoogleMapEmbed;

import React, { useState } from 'react';
import AiImage from '../../assets/ai-support.png';
import './CardSlider.scss';
import { WiStars } from "react-icons/wi";
import { GoHeart } from "react-icons/go";
import { TbShieldHalf } from "react-icons/tb";

const cards = [
  {
    title: 'Tư vấn sĩ chuyên nghiệp',
    bgColor: '#2D2D2D',
    textColor: '#FFD8F3',
    image: AiImage,
    icon: <GoHeart />
  },
  {
    title: 'Kho kiến thức trực tuyến',
    bgColor: '#D7D7D7',
    textColor: '#FF85DA',
    image: AiImage,
    icon: <TbShieldHalf />
  },
  {
    title: 'Hỗ trợ tư vấn bằng AI',
    bgColor: '#ffffff',
    textColor: '#000000',
    image: AiImage,
    icon: <WiStars />
  },
];

export default function CardSlider() {
  const [cardStack, setCardStack] = useState([0, 1, 2]); // Initial order: [top, middle, bottom]
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCardClick = (clickedIndex) => {
    if (isAnimating) return; // Prevent clicking during animation
    
    setIsAnimating(true);
    setCardStack(prevStack => {
      const newStack = [...prevStack];
      
      // Nếu click vào thẻ giữa
      if (clickedIndex === 1) {
        // Thẻ đầu -> thẻ cuối
        const firstCard = newStack[0];
        newStack.shift();
        newStack.push(firstCard);
      }
      // Nếu click vào thẻ cuối
      else if (clickedIndex === 2) {
        // Thẻ đầu -> thẻ giữa
        const firstCard = newStack[0];
        newStack.shift();
        newStack.splice(1, 0, firstCard);
      }
      
      return newStack;
    });

    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 600); // Match this with CSS transition duration
  };

  return (
    <div className="card-slider-container">
      <h2 className="slider-title">
        Hãy tận hưởng dịch vụ chuyên nghiệp của chúng tôi.
      </h2>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className={`stacked-cards ${isAnimating ? 'animating' : ''}`}>
              {cardStack.map((cardIndex, stackIndex) => (
                <div
                  key={cardIndex}
                  className={`card ${stackIndex === 0 ? 'top' : stackIndex === 1 ? 'middle' : 'bottom'}`}
                  onClick={() => handleCardClick(stackIndex)}
                  style={{
                    backgroundColor: cards[cardIndex].bgColor,
                    color: cards[cardIndex].textColor,
                  }}
                >
                  <div className="card-content">
                    <div className="text-area">
                      <h3>{cards[cardIndex].title}</h3>
                    </div>
                    {cards[cardIndex].image && (
                      <img src={cards[cardIndex].image} alt="Card visual" />
                    )}
                    <div className="icon">{cards[cardIndex].icon}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

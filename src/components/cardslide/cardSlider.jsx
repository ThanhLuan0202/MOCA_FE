import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import AiImage from '../../assets/ai-support.png'
import './CardSlider.scss'; // 👈 bạn tạo file CSS riêng cho custom hiệu ứng
import { WiStars } from "react-icons/wi";
import { GoHeart } from "react-icons/go";
import { TbShieldHalf } from "react-icons/tb";

import 'bootstrap/dist/css/bootstrap.min.css';

const cards = [
  {
    title: 'Tư vấn sĩ chuyên nghiệp',
    bgColor: '#2D2D2D',
    textColor: '#FFD8F3',
    image: AiImage,
    icon: <GoHeart />

    ,
  },
  {
    title: 'Kho kiến thức trực tuyến',
    bgColor: '#D7D7D7',
    textColor: '#FF85DA',
    image: AiImage,
    icon: <TbShieldHalf />
    ,
  },
  {
    title: 'Hỗ trợ tư vấn bằng AI',
    bgColor: '#ffffff',
    textColor: '#000000',
    image: AiImage,
    icon: <WiStars />
    ,
  },
];

export default function CardSlider() {
  return (
    <div className="card-slider-container">
      <h2 className="slider-title">
        Hãy tận hưởng dịch vụ chuyên nghiệp của chúng tôi.
      </h2>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              loop={true}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: false,
              }}
              pagination={{ clickable: true }}
              modules={[EffectCoverflow, Pagination]}
              className="card-swiper"
            >

              {cards.map((card, index) => (
                <SwiperSlide key={index} className="card-slide">
                  <div
                    className="card"
                    style={{ backgroundColor: card.bgColor, color: card.textColor }}
                  >
                    <div className="card-content">
                      <div className="text-area">
                        <h3>{card.title}</h3>
                      </div>
                      {card.image && (
                        <img src={card.image} alt="Card visual" />
                      )}
                      <div className="icon">{card.icon}</div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}

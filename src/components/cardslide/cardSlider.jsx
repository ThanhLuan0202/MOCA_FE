import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './CardSlider.scss'; // 👈 bạn tạo file CSS riêng cho custom hiệu ứng

const cards = [
  {
    title: 'Tư vấn sĩ chuyên nghiệp',
    bgColor: '#2D2D2D',
    textColor: '#FFB0E9',
    icon: '💗',
  },
  {
    title: 'Kho kiến thức trực tuyến',
    bgColor: '#D9D9D9',
    textColor: '#FF85DA',
    icon: '🛡️',
  },
  {
    title: 'Hỗ trợ tư vấn bằng AI',
    bgColor: '#ffffff',
    textColor: '#000000',
    image: '/card-ai.png',
    icon: '✨',
  },
];

export default function CardSlider() {
  return (
    <div className="card-slider-container">
      <h2 className="slider-title">
        Hãy tận hưởng dịch vụ chuyên nghiệp của chúng tôi.
      </h2>

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
                <h3>{card.title}</h3>
                {card.image ? (
                  <img src={card.image} alt="Card visual" />
                ) : (
                  <div className="icon">{card.icon}</div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

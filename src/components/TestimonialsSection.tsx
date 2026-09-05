"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const testimonials = [
  {
    quote:
      "FlowSync completely changed how I run my freelance design business. I used to spend 10 hours a week just organizing Notion boards and chasing invoices. Now it's all automated.",
    author: "Sarah J.",
    role: "Freelance UI/UX Designer",
    avatar:
      "https://i.pravatar.cc/150?u=sarah",
  },
  {
    quote:
      "We replaced Asana, Hubspot, and QuickBooks with FlowSync. It's the cleanest, fastest piece of software our agency has ever used. The AI email parsing is literal magic.",
    author: "Mark T.",
    role: "Founder, Creative Agency",
    avatar:
      "https://i.pravatar.cc/150?u=mark",
  },
  {
    quote:
      "Finally, a tool that actually looks good and works fast. The Notion-like interface makes taking client notes a breeze, and the integrated invoicing means I get paid faster.",
    author: "Elena R.",
    role: "Independent Consultant",
    avatar:
      "https://i.pravatar.cc/150?u=elena",
  },
  {
    quote:
      "FlowSync brought our projects, clients, meetings, and invoices into one place. Our team spends less time switching tools and more time delivering work.",
    author: "Daniel K.",
    role: "Creative Studio Owner",
    avatar:
      "https://i.pravatar.cc/150?u=daniel",
  },
  {
    quote:
      "The workflow is incredibly simple. I can track a project from client onboarding to payment without jumping between different platforms.",
    author: "Priya M.",
    role: "Freelance Product Designer",
    avatar:
      "https://i.pravatar.cc/150?u=priya",
  },
];

/*
 * Three copies create a continuous circular track.
 *
 * [1 2 3 4 5] [1 2 3 4 5] [1 2 3 4 5]
 *              ↑
 *        start in middle copy
 */
const extendedTestimonials = [
  ...testimonials,
  ...testimonials,
  ...testimonials,
];

export function TestimonialsSection() {
  const viewportRef =
    useRef<HTMLDivElement>(null);

  const [viewportWidth, setViewportWidth] =
    useState(0);

  /*
   * Start in the middle copy.
   * Index 5 = first card of second copy.
   */
  const [activeIndex, setActiveIndex] =
    useState(testimonials.length);

  const [isSnapping, setIsSnapping] =
    useState(false);

  const [isDragging, setIsDragging] =
  useState(false);

const [dragOffset, setDragOffset] =
  useState(0);

const dragStartX =
  useRef(0);

const currentDragOffset =
  useRef(0);

  const cardWidth = 360;
  const gap = 24;
  const step = cardWidth + gap;

  /*
   * Measure viewport
   */
  useEffect(() => {
    const updateViewport = () => {
      if (viewportRef.current) {
        setViewportWidth(
          viewportRef.current.clientWidth
        );
      }
    };

    updateViewport();

    window.addEventListener(
      "resize",
      updateViewport
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateViewport
      );
    };
  }, []);

  /*
   * Center active card
   */
  const translateX =
    viewportWidth > 0
      ? viewportWidth / 2 -
        cardWidth / 2 -
        activeIndex * step
      : 0;

  /*
   * Logical testimonial index
   */
  const currentIndex =
    ((activeIndex -
      testimonials.length) %
      testimonials.length +
      testimonials.length) %
    testimonials.length;

  /*
   * Move right
   */
  const goNext = () => {
    if (isSnapping) return;

    setActiveIndex(
      (current) => current + 1
    );
  };

  /*
   * Move left
   */
  const goPrevious = () => {
    if (isSnapping) return;

    setActiveIndex(
      (current) => current - 1
    );
  };

  const handlePointerDown = (
  event: React.PointerEvent
) => {
  if (isSnapping) return;

  setIsDragging(true);

  dragStartX.current =
    event.clientX;

  currentDragOffset.current = 0;

  (
    event.currentTarget as HTMLElement
  ).setPointerCapture(event.pointerId);
};

const handlePointerMove = (
  event: React.PointerEvent
) => {
  if (!isDragging) return;

  const offset =
    event.clientX -
    dragStartX.current;

  currentDragOffset.current =
    offset;

  setDragOffset(offset);
};

const handlePointerUp = (
  event: React.PointerEvent
) => {
  if (!isDragging) return;

  setIsDragging(false);

  const offset =
    currentDragOffset.current;

  const threshold = 80;

  if (offset < -threshold) {
    setDragOffset(0);
    goNext();
    return;
  }

  if (offset > threshold) {
    setDragOffset(0);
    goPrevious();
    return;
  }

  setDragOffset(0);

  (
    event.currentTarget as HTMLElement
  ).releasePointerCapture?.(
    event.pointerId
  );
};

  /*
   * Seamless circular reset.
   *
   * We NEVER reset while the user sees
   * the movement. The reset happens after
   * the slide has completed.
   */
  const handleAnimationComplete = () => {
    /*
     * We moved into the third copy.
     * Jump silently back to the identical
     * position in the middle copy.
     */
    if (activeIndex >= 10) {
      setIsSnapping(true);
      setActiveIndex(5);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsSnapping(false);
        });
      });

      return;
    }

    /*
     * We moved into the first copy.
     * Jump silently back to the identical
     * position in the middle copy.
     */
    if (activeIndex <= 4) {
      setIsSnapping(true);
      setActiveIndex(9);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsSnapping(false);
        });
      });
    }
  };

  return (
    <section className="py-24 bg-muted/30 overflow-hidden">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-12 px-4">

          <h2 className="text-3xl font-bold mb-4">
            Loved by top freelancers and agencies
          </h2>

          <p className="text-muted-foreground">
            Don't just take our word for it.
          </p>

        </div>

        {/* CAROUSEL */}

        <div className="relative">

          {/* LEFT ARROW */}

          <button
            type="button"
            onClick={goPrevious}
            aria-label="Previous testimonial"
            className="
              absolute
              left-4
              md:left-6
              top-1/2
              -translate-y-1/2
              z-30
              w-11
              h-11
              rounded-full
              bg-background
              border
              border-border
              shadow-md
              flex
              items-center
              justify-center
              text-muted-foreground
              hover:text-foreground
              hover:bg-muted
              transition
            "
          >
            <ChevronLeft size={20} />
          </button>

          {/* RIGHT ARROW */}

          <button
            type="button"
            onClick={goNext}
            aria-label="Next testimonial"
            className="
              absolute
              right-4
              md:right-6
              top-1/2
              -translate-y-1/2
              z-30
              w-11
              h-11
              rounded-full
              bg-background
              border
              border-border
              shadow-md
              flex
              items-center
              justify-center
              text-muted-foreground
              hover:text-foreground
              hover:bg-muted
              transition
            "
          >
            <ChevronRight size={20} />
          </button>

          {/* VIEWPORT */}
            <div
  ref={viewportRef}
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
  onPointerCancel={() => {
    setIsDragging(false);
    setDragOffset(0);
  }}
  className={`
    w-full
    overflow-hidden
    px-14
    md:px-20
    py-10
    select-none
    ${
      isDragging
        ? "cursor-grabbing"
        : "cursor-grab"
    }
  `}
>

            {/* TRACK */}
              <motion.div
  className="
    flex
    items-center
    gap-6
  "
  animate={{
    x: translateX + dragOffset,
  }}
  transition={
  isDragging
    ? {
        duration: 0,
      }
    : isSnapping
    ? {
        duration: 0,
      }
    : {
        duration: 0.65,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }
}
              onAnimationComplete={
                handleAnimationComplete
              }
            >

              {extendedTestimonials.map(
                (testimonial, index) => {

                  const isCenter =
                    index === activeIndex;

                  return (
                    <motion.div
                      key={`${testimonial.author}-${index}`}
                      animate={{
                        scale: isCenter
                          ? 1.04
                          : 0.92,

                        opacity: isCenter
                          ? 1
                          : 0.68,
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                      className="
                        shrink-0
                        w-[360px]
                      "
                    >

                      <div
                        className={`
                          bg-background
                          border
                          p-6
                          rounded-2xl
                          h-full
                          ${
                            isCenter
                              ? "border-gray-900 shadow-lg"
                              : "border-border shadow-sm"
                          }
                        `}
                      >

                        {/* STARS */}

                        <div className="
                          flex
                          gap-1
                          mb-4
                        ">
                          {[1, 2, 3, 4, 5].map(
                            (star) => (
                              <Star
                                key={star}
                                className="
                                  w-4
                                  h-4
                                  fill-primary-500
                                  text-primary-500
                                "
                              />
                            )
                          )}
                        </div>

                        {/* QUOTE */}

                        <p className="
                          text-foreground
                          mb-6
                          leading-relaxed
                        ">
                          "{testimonial.quote}"
                        </p>

                        {/* AUTHOR */}

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">

                          <img
                            src={
                              testimonial.avatar
                            }
                            alt={
                              testimonial.author
                            }
                            className="
                              w-10
                              h-10
                              rounded-full
                              object-cover
                            "
                          />

                          <div>

                            <div className="
                              font-semibold
                              text-sm
                            ">
                              {
                                testimonial.author
                              }
                            </div>

                            <div className="
                              text-xs
                              text-muted-foreground
                            ">
                              {
                                testimonial.role
                              }
                            </div>

                          </div>

                        </div>

                      </div>

                    </motion.div>
                  );
                }
              )}

            </motion.div>

          </div>

        </div>

        {/* DOT INDICATORS */}

        <div className="
          flex
          justify-center
          items-center
          gap-2
          mt-4
        ">

          {testimonials.map(
            (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (isSnapping) return;

                  setActiveIndex(
                    testimonials.length +
                      index
                  );
                }}
                aria-label={`Go to testimonial ${
                  index + 1
                }`}
                className={`
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    currentIndex === index
                      ? "w-6 h-2 bg-primary-500"
                      : "w-2 h-2 bg-border"
                  }
                `}
              />
            )
          )}

        </div>

      </div>

    </section>
  );
}
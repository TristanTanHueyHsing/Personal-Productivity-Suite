import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import './Homepage.css';

const Homepage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState('');
    const [animateElements, setAnimateElements] = useState(false);

    // Daily rotating quotes
    const inspirationalQuotes = [
        "Progress, not perfection, is the goal.",
        "Small steps every day lead to big changes every year.",
        "You are stronger than you think and more capable than you imagine.",
        "Focus on what you can control, let go of what you can't.",
        "Every moment is a chance to begin again.",
        "Believe in yourself and all that you are.",
        "The only impossible journey is the one you never begin."
    ];

    const todaysQuote = inspirationalQuotes[new Date().getDate() % inspirationalQuotes.length];

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimateElements(true);
        }, 300);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const hour = currentTime.getHours();
        if (hour < 12) {
            setGreeting('Good Morning');
        } else if (hour < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }
    }, [currentTime]);

    const formatTime = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="app-container-homepage">
            <Sidebar />
            <main className="main-content-homepage">
                {/* Greeting Section */}
                <section className={`homepage-card greeting-card ${animateElements ? 'fade-in' : ''}`}>
                    <div className="greeting-content">
                        <h1 className="greeting-title">🌤️ {greeting}!</h1>
                        <p className="greeting-date">{formatTime(currentTime)}</p>
                        <blockquote className="daily-quote">"{todaysQuote}"</blockquote>
                    </div>
                </section>

                {/* Information Grid */}
                <div className="info-container">
                    {/* Productivity Tips */}
                    <section className={`info-section tips-section ${animateElements ? 'slide-up' : ''}`}>
                        <h2 className="section-title">💡 Productivity Wisdom</h2>
                        <div className="tips-list">
                            <div className="tip-item">
                                <div className="tip-number">01</div>
                                <div className="tip-content">
                                    <h4>The 2-Minute Rule</h4>
                                    <p>If something takes less than 2 minutes, do it immediately rather than putting it off.</p>
                                </div>
                            </div>
                            <div className="tip-item">
                                <div className="tip-number">02</div>
                                <div className="tip-content">
                                    <h4>Time Blocking</h4>
                                    <p>Schedule specific blocks of time for different types of work to maintain focus.</p>
                                </div>
                            </div>
                            <div className="tip-item">
                                <div className="tip-number">03</div>
                                <div className="tip-content">
                                    <h4>Single-Tasking</h4>
                                    <p>Focus on one task at a time to improve both quality and efficiency.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Ways to Destress */}
                    <section className={`info-section destress-section ${animateElements ? 'slide-up' : ''}`}>
                        <h2 className="section-title">🌿 Ways to Destress</h2>
                        <div className="destress-list">
                            <div className="destress-item">
                                <div className="destress-icon">🚶‍♀️</div>
                                <div className="destress-content">
                                    <h4>Take a Walk</h4>
                                    <p>A 10-minute walk in nature can reduce cortisol levels and clear your mind.</p>
                                </div>
                            </div>
                            <div className="destress-item">
                                <div className="destress-icon">🎵</div>
                                <div className="destress-content">
                                    <h4>Listen to Music</h4>
                                    <p>Slow tempo music can lower heart rate and reduce stress hormones.</p>
                                </div>
                            </div>
                            <div className="destress-item">
                                <div className="destress-icon">📖</div>
                                <div className="destress-content">
                                    <h4>Read Something Light</h4>
                                    <p>Reading for just 6 minutes can reduce stress levels by up to 68%.</p>
                                </div>
                            </div>
                            <div className="destress-item">
                                <div className="destress-icon">🧘‍♂️</div>
                                <div className="destress-content">
                                    <h4>Practice Deep Breathing</h4>
                                    <p>5 minutes of focused breathing can activate your body's relaxation response.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Positivity Boost */}
                    <section className={`info-section positivity-section ${animateElements ? 'slide-up' : ''}`}>
                        <h2 className="section-title">☀️ Positivity Boost</h2>
                        <div className="positivity-content">
                            <div className="gratitude-reminder">
                                <div className="gratitude-header">
                                    <span className="gratitude-icon">🙏</span>
                                    <h4>Practice Gratitude</h4>
                                </div>
                                <p>Think of three things you're grateful for today. Gratitude rewires your brain for happiness.</p>
                            </div>
                            <div className="positive-affirmations">
                                <h4>💫 Daily Affirmations</h4>
                                <div className="affirmations-grid">
                                    <div className="affirmation-card">
                                        <span className="affirmation-text">"I am capable of amazing things"</span>
                                    </div>
                                    <div className="affirmation-card">
                                        <span className="affirmation-text">"Every challenge helps me grow"</span>
                                    </div>
                                    <div className="affirmation-card">
                                        <span className="affirmation-text">"I choose to focus on what I can control"</span>
                                    </div>
                                </div>
                            </div>
                            <div className="smile-reminder">
                                <span className="smile-icon">😊</span>
                                <span className="smile-text">Smiling, even when you don't feel like it, can boost your mood!</span>
                            </div>
                        </div>
                    </section>

                    {/* Mindfulness Corner */}
                    <section className={`info-section mindfulness-section ${animateElements ? 'slide-up' : ''}`}>
                        <h2 className="section-title">🧘 Mindful Moments</h2>
                        <div className="mindfulness-content">
                            <div className="breathing-exercise">
                                <div className="breathing-circle">
                                    <div className="circle-inner"></div>
                                </div>
                                <div className="breathing-text">
                                    <h4>4-7-8 Breathing</h4>
                                    <p>Inhale for 4, hold for 7, exhale for 8. Repeat 3-4 times for instant calm.</p>
                                </div>
                            </div>
                            <div className="mindfulness-tips">
                                <div className="mindful-tip">
                                    <span className="tip-emoji">🌅</span>
                                    <span className="tip-text">Start your day with 5 minutes of silence</span>
                                </div>
                                <div className="mindful-tip">
                                    <span className="tip-emoji">🫖</span>
                                    <span className="tip-text">Practice mindful eating - savor each bite</span>
                                </div>
                                <div className="mindful-tip">
                                    <span className="tip-emoji">🚶</span>
                                    <span className="tip-text">Take mindful walks without distractions</span>
                                </div>
                            </div>
                            <div className="mindful-reminder">
                                <span className="reminder-icon">🌸</span>
                                <span className="reminder-text">"This moment is all we truly have"</span>
                            </div>
                        </div>
                    </section>


                </div>
            </main>
        </div>
    );
};

export default Homepage;
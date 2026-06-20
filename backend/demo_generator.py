import pandas as pd
import numpy as np
import os
import random
from datetime import datetime, timedelta

def generate_large_demo_csv(target_path: str) -> None:
    """
    Generates a realistic marketing dataset of 1000+ rows
    and saves it to target_path.
    """
    # Parameters
    start_date = datetime(2026, 5, 1)
    days_count = 45
    
    # 25 realistic campaign profiles: (Campaign Name, Channel, Base Daily Spend, CPM, CTR, Conv Rate, ROI)
    campaigns = [
        # Google Ads (Search/Shopping)
        ("Google Search - Brand Campaign", "Google Ads", 350, 45, 0.12, 0.18, 8.2),
        ("Google Search - Generic Keywords", "Google Ads", 500, 30, 0.04, 0.05, 1.8),
        ("Google Search - Competitors", "Google Ads", 300, 35, 0.02, 0.015, 0.3),
        ("Google Shopping - Smart", "Google Ads", 450, 20, 0.06, 0.04, 2.4),
        ("Google PMax - Performance", "Google Ads", 600, 22, 0.05, 0.045, 2.1),
        
        # Facebook Ads (Social Prospecting & Retargeting)
        ("Facebook Retargeting Campaign", "Facebook Ads", 600, 18, 0.03, 0.015, 0.6),
        ("FB Prospecting - Lookalike 1%", "Facebook Ads", 400, 12, 0.025, 0.03, 1.4),
        ("FB Prospecting - Lookalike 5%", "Facebook Ads", 300, 10, 0.018, 0.02, 0.9),
        ("FB Prospecting - Broad Interests", "Facebook Ads", 350, 8, 0.015, 0.012, 0.7),
        ("FB Dynamic Product Ads", "Facebook Ads", 250, 14, 0.05, 0.06, 3.2),
        
        # Instagram (Visual placement focus)
        ("Instagram Reels Video", "Instagram Ads", 200, 9, 0.03, 0.015, 0.6),
        ("Instagram Stories Carousel", "Instagram Ads", 180, 11, 0.035, 0.025, 1.5),
        ("Instagram Explore Grid", "Instagram Ads", 120, 7, 0.015, 0.01, 0.8),
        ("Instagram Influencer Promo", "Instagram Ads", 450, 15, 0.06, 0.08, 3.8),
        
        # LinkedIn (High-cost, high-value B2B leads)
        ("LinkedIn Sponsored InMail", "LinkedIn Ads", 550, 90, 0.012, 0.08, 2.9),
        ("LinkedIn Lead Gen Form", "LinkedIn Ads", 700, 110, 0.015, 0.10, 3.3),
        ("LinkedIn Conversation Ads", "LinkedIn Ads", 400, 80, 0.010, 0.06, 1.9),
        ("LinkedIn Text Sidebar Ads", "LinkedIn Ads", 150, 40, 0.003, 0.02, 0.5),
        
        # YouTube (Awareness vs Action)
        ("YouTube Brand Awareness", "YouTube Ads", 500, 6, 0.012, 0.002, 0.1),
        ("YouTube InStream - Video Action", "YouTube Ads", 400, 14, 0.03, 0.022, 1.6),
        ("YouTube Bumper Ads", "YouTube Ads", 300, 5, 0.008, 0.001, 0.05),
        
        # Other (WhatsApp Marketing, Email Marketing, Newsletters)
        ("WhatsApp Broadcast Promo", "WhatsApp Marketing", 250, 5, 0.18, 0.08, 2.8),
        ("Email Newsletter Campaign", "Email Marketing", 150, 8, 0.15, 0.08, 6.2),
        ("Co-marketing Partner Newsletter", "Newsletters", 200, 25, 0.05, 0.08, 3.0)
    ]
    
    rows = []
    
    # Set seed for deterministic generation
    np.random.seed(42)
    random.seed(42)
    
    for day in range(days_count):
        current_date = start_date + timedelta(days=day)
        date_str = current_date.strftime("%Y-%m-%d")
        
        # Add day-of-week factor to make trend charts wave realistically (higher on weekends/weekdays depending on profile)
        day_of_week = current_date.weekday()
        # Assume weekends have slightly lower business/conversion rate but higher social browsing
        weekend_factor = 0.85 if day_of_week >= 5 else 1.05
        
        # Introduce a general mid-month spike for realistic trend charts
        date_factor = 1.0
        if 12 <= current_date.day <= 18:
            date_factor = 1.25  # Mid-month sales campaign
            
        for name, channel, base_spend, cpm, ctr, conv_rate, target_roi in campaigns:
            # 1. Spend: add +/- 15% random variation
            spend = base_spend * random.uniform(0.85, 1.15) * date_factor
            
            # 2. Impressions: Spend / (CPM/1000)
            base_impressions = (spend / cpm) * 1000
            impressions = int(base_impressions * random.uniform(0.9, 1.1))
            
            # 3. Clicks: Impressions * CTR
            clicks = int(impressions * ctr * random.uniform(0.85, 1.15) * weekend_factor)
            if clicks < 1 and impressions > 10:
                clicks = 1
                
            # 4. Conversions: Clicks * conv_rate
            conversions = int(clicks * conv_rate * random.uniform(0.8, 1.2) * weekend_factor)
            if conversions < 0:
                conversions = 0
                
            # 5. Revenue: Spend * Target ROI + random noise
            revenue = spend * target_roi * random.uniform(0.8, 1.2) * date_factor * weekend_factor
            
            # Ensure zero conversions results in near zero revenue
            if conversions == 0:
                revenue = max(0.0, float(random.randint(0, 45)))
            else:
                # Align conversions to revenue logically
                avg_order_value = (spend * target_roi) / (base_spend * ctr * conv_rate * (base_impressions / 1000) + 1)
                revenue = max(revenue, conversions * avg_order_value * random.uniform(0.9, 1.1))
            
            # Round values
            spend = round(spend, 2)
            revenue = round(revenue, 2)
            
            rows.append({
                "Date": date_str,
                "Campaign": name,
                "Channel": channel,
                "Spend": spend,
                "Impressions": impressions,
                "Clicks": clicks,
                "Conversions": conversions,
                "Revenue": revenue
            })
            
    df = pd.DataFrame(rows)
    df.to_csv(target_path, index=False)
    print(f"Generated {len(df)} sample records in demo dataset at {target_path}")

if __name__ == "__main__":
    # Test script execution
    generate_large_demo_csv("demo_dataset_test.csv")

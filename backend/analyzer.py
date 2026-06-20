import pandas as pd
import numpy as np
import os
import math
from typing import Dict, Any, List, Tuple

# Predefined synonyms for auto-mapping
COLUMN_MAPPING_DICTIONARY = {
    'Spend': ['spend', 'ad spend', 'adspend', 'cost', 'budget', 'amount', 'investment'],
    'Revenue': ['revenue', 'sales', 'income', 'value', 'turnover', 'earnings', 'revenue_usd', 'revenue_inr'],
    'Conversions': ['conversions', 'conversion', 'transactions', 'leads', 'orders', 'purchases', 'signups'],
    'Clicks': ['clicks', 'click', 'clicks_count'],
    'Impressions': ['impressions', 'impression', 'views', 'reach', 'impr'],
    'Campaign': ['campaign', 'campaign name', 'campaign_name', 'name', 'ad group', 'adgroup'],
    'Channel': ['channel', 'source', 'medium', 'marketing channel', 'platform', 'publisher']
}

def auto_map_columns(df_columns: List[str]) -> Tuple[Dict[str, str], Dict[str, str]]:
    """
    Scans DataFrame columns and maps them to standard names based on synonyms.
    Returns:
        mapped_columns: Map of standard name -> raw file column name.
        rename_dict: Map of raw file column name -> standard name (for df.rename).
    """
    mapped_columns = {}
    rename_dict = {}
    
    # Clean column names for comparison (lowercase, strip spaces/underscores)
    clean_cols = {col: col.lower().replace('_', ' ').replace('-', ' ').strip() for col in df_columns}
    
    for standard_col, synonyms in COLUMN_MAPPING_DICTIONARY.items():
        found = False
        # Direct exact or clean match
        for raw_col, clean_col in clean_cols.items():
            if clean_col == standard_col.lower():
                mapped_columns[standard_col] = raw_col
                rename_dict[raw_col] = standard_col
                found = True
                break
        
        # Synonym match
        if not found:
            for raw_col, clean_col in clean_cols.items():
                if any(syn in clean_col for syn in synonyms):
                    mapped_columns[standard_col] = raw_col
                    rename_dict[raw_col] = standard_col
                    break
                    
    return mapped_columns, rename_dict

def read_marketing_file(file_path: str) -> pd.DataFrame:
    """Reads a CSV or Excel file into a Pandas DataFrame with robust error handling."""
    if not os.path.exists(file_path):
        raise ValueError("This file appears to be empty. Please upload a valid CSV or Excel file.")
        
    size = os.path.getsize(file_path)
    if size == 0:
        raise ValueError("This file appears to be empty. Please upload a valid CSV or Excel file.")
        
    ext = os.path.splitext(file_path)[1].lower()
    if ext in ['.xlsx', '.xls']:
        try:
            # Parse Excel
            df = pd.read_excel(file_path)
            df = df.dropna(how='all')
            if df.empty or len(df.columns) == 0:
                raise ValueError("This file appears to be empty. Please upload a valid CSV or Excel file.")
            return df
        except Exception as e:
            if "empty" in str(e).lower() or "no columns" in str(e).lower():
                raise ValueError("This file appears to be empty. Please upload a valid CSV or Excel file.")
            raise ValueError(f"Uploaded file contains no valid marketing data. Error: {str(e)}")
    elif ext == '.csv':
        try:
            df = pd.read_csv(file_path)
            df = df.dropna(how='all')
            if df.empty or len(df.columns) == 0:
                raise ValueError("This file appears to be empty. Please upload a valid CSV or Excel file.")
            return df
        except pd.errors.EmptyDataError:
            raise ValueError("This file appears to be empty. Please upload a valid CSV or Excel file.")
        except Exception:
            # Fallback to alternative encodings
            for encoding in ['latin-1', 'cp1252', 'utf-16']:
                try:
                    df = pd.read_csv(file_path, encoding=encoding)
                    df = df.dropna(how='all')
                    if not df.empty and len(df.columns) > 0:
                        return df
                except Exception:
                    continue
            raise ValueError("Uploaded file contains no valid marketing data. Please upload a valid CSV or Excel dataset.")
    else:
        raise ValueError("Unsupported file format. Please upload a valid CSV or Excel file (.csv, .xlsx, .xls).")

def get_preview_data(file_path: str) -> Dict[str, Any]:
    """Reads file, executes auto-mapping, and extracts first 10 rows for display."""
    df = read_marketing_file(file_path)
    raw_columns = list(df.columns)
    mapped_columns, _ = auto_map_columns(raw_columns)
    
    # Format dates in preview if date column exists
    date_col = mapped_columns.get('Date')
    if date_col and date_col in df.columns:
        try:
            df[date_col] = pd.to_datetime(df[date_col]).dt.strftime('%Y-%m-%d')
        except Exception:
            pass
            
    # Calculate date range
    date_range_str = "Active Dataset"
    if date_col and date_col in df.columns:
        try:
            dates = pd.to_datetime(df[date_col])
            min_date = dates.min().strftime('%b %d, %Y')
            max_date = dates.max().strftime('%b %d, %Y')
            date_range_str = f"{min_date} - {max_date}"
        except Exception:
            pass

    # Replace NaNs with empty string in preview to prevent JSON serialization errors
    df_preview = df.head(10).replace({np.nan: None})
    preview_rows = df_preview.to_dict(orient='records')
    
    return {
        'rowCount': len(df),
        'colCount': len(df.columns),
        'columns': raw_columns,
        'mappedColumns': mapped_columns,
        'previewRows': preview_rows,
        'dateRange': date_range_str
    }

def clean_and_map_df(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, str]]:
    """Renames and fills missing columns, formatting fields properly, and validates columns."""
    raw_columns = list(df.columns)
    mapped_columns, rename_dict = auto_map_columns(raw_columns)
    
    # Validate that required columns can be mapped
    required_cols = ['Campaign', 'Channel', 'Spend', 'Revenue', 'Conversions']
    missing_cols = [c for c in required_cols if c not in mapped_columns]
    if missing_cols:
        raise ValueError(f"Missing required columns: {', '.join(missing_cols)}. The dataset must contain columns for Campaign, Channel, Spend, Revenue, and Conversions.")
    
    # Rename matching columns
    df_renamed = df.rename(columns=rename_dict)
    
    # Ensure all standard columns exist, filling defaults if missing
    standard_defaults = {
        'Spend': 0.0,
        'Revenue': 0.0,
        'Conversions': 0,
        'Clicks': 0,
        'Impressions': 0,
        'Campaign': 'General Campaign',
        'Channel': 'General Channel'
    }
    
    for col, default in standard_defaults.items():
        if col not in df_renamed.columns:
            df_renamed[col] = default
        else:
            if col in ['Spend', 'Revenue']:
                df_renamed[col] = pd.to_numeric(df_renamed[col], errors='coerce').fillna(default)
            elif col in ['Conversions', 'Clicks', 'Impressions']:
                df_renamed[col] = pd.to_numeric(df_renamed[col], errors='coerce').fillna(default).astype(int)
            else:
                df_renamed[col] = df_renamed[col].fillna(default).astype(str)
                
    # Normalize Date column
    if 'Date' in df_renamed.columns:
        try:
            df_renamed['Date'] = pd.to_datetime(df_renamed['Date']).dt.strftime('%b %d')
        except Exception:
            df_renamed['Date'] = df_renamed['Date'].astype(str)
    else:
        df_renamed['Date'] = 'Day 1'
        
    return df_renamed, mapped_columns

def process_marketing_analysis(file_path: str) -> Dict[str, Any]:
    """Runs all marketing metrics, channel allocations, and optimizations."""
    df_raw = read_marketing_file(file_path)
    df, mapped_columns = clean_and_map_df(df_raw)
    
    # 1. Calculate General KPIs
    total_spend = float(df['Spend'].sum())
    total_revenue = float(df['Revenue'].sum())
    roi = (total_revenue / total_spend) if total_spend > 0 else 0.0
    conversions = int(df['Conversions'].sum())
    clicks = int(df['Clicks'].sum())
    avg_cpa = (total_spend / conversions) if conversions > 0 else 0.0
    
    # 2. Daily Time Series
    daily_grouped = df.groupby('Date').agg({
        'Spend': 'sum',
        'Revenue': 'sum',
        'Conversions': 'sum',
        'Clicks': 'sum'
    }).reset_index()
    
    # Calculate daily derived metrics
    daily_grouped['roi'] = np.where(daily_grouped['Spend'] > 0, daily_grouped['Revenue'] / daily_grouped['Spend'], 0.0)
    daily_grouped['cpa'] = np.where(daily_grouped['Conversions'] > 0, daily_grouped['Spend'] / daily_grouped['Conversions'], 0.0)
    
    # Format and replace NaNs for serialization
    daily_grouped = daily_grouped.rename(columns={
        'Spend': 'spend',
        'Revenue': 'revenue',
        'Conversions': 'conversions',
        'Clicks': 'clicks',
        'Date': 'date'
    }).replace({np.nan: 0.0})
    campaign_time_data = daily_grouped.to_dict(orient='records')
    
    # 3. Channel Breakdown
    channel_grouped = df.groupby('Channel').agg({
        'Spend': 'sum',
        'Revenue': 'sum',
        'Conversions': 'sum',
        'Clicks': 'sum',
        'Impressions': 'sum'
    }).reset_index()
    
    channel_grouped['roi'] = np.where(channel_grouped['Spend'] > 0, channel_grouped['Revenue'] / channel_grouped['Spend'], 0.0)
    channel_grouped['cpa'] = np.where(channel_grouped['Conversions'] > 0, channel_grouped['Spend'] / channel_grouped['Conversions'], 0.0)
    
    channel_grouped = channel_grouped.rename(columns={
        'Spend': 'spend',
        'Revenue': 'revenue',
        'Conversions': 'conversions',
        'Clicks': 'clicks',
        'Impressions': 'impressions',
        'Channel': 'channel'
    }).replace({np.nan: 0.0})
    
    channel_data = channel_grouped.to_dict(orient='records')
    
    # 4. Budget Optimization (Rule-based)
    # Find channels with positive spend
    valid_channels = channel_grouped[channel_grouped['spend'] > 0]
    
    budget_opt = {
        'recommendation': 'Keep budget allocation as is.',
        'expectedImprovement': 0.0,
        'fromChannel': '',
        'toChannel': '',
        'shiftAmount': 0.0
    }
    
    if len(valid_channels) >= 2:
        # Highest and Lowest ROI Channels
        highest_idx = valid_channels['roi'].idxmax()
        lowest_idx = valid_channels['roi'].idxmin()
        
        highest_channel = valid_channels.loc[highest_idx]
        lowest_channel = valid_channels.loc[lowest_idx]
        
        # Check if there is room for optimization (significant difference)
        if highest_channel['roi'] > lowest_channel['roi'] + 0.2:
            # Shift 15% of the lowest ROI channel spend, capped or rounded
            shift_amount = float(lowest_channel['spend'] * 0.15)
            shift_amount = math.ceil(shift_amount / 100) * 100  # Round up to nearest 100
            
            # Revenue lift formula: Shift Amount * (ROI_diff)
            roi_diff = float(highest_channel['roi'] - lowest_channel['roi'])
            rev_lift = shift_amount * roi_diff
            pct_improvement = (rev_lift / total_revenue * 100) if total_revenue > 0 else 0.0
            
            budget_opt = {
                'recommendation': f"Reallocate ₹{shift_amount:,.0f} budget from {lowest_channel['channel']} to {highest_channel['channel']}.",
                'expectedImprovement': round(pct_improvement, 1),
                'fromChannel': str(lowest_channel['channel']),
                'toChannel': str(highest_channel['channel']),
                'shiftAmount': shift_amount
            }

    # 5. Wasted Spend Analysis (Rule-based)
    campaign_grouped = df.groupby(['Campaign', 'Channel']).agg({
        'Spend': 'sum',
        'Revenue': 'sum',
        'Conversions': 'sum'
    }).reset_index()
    
    campaign_grouped['roi'] = np.where(campaign_grouped['Spend'] > 0, campaign_grouped['Revenue'] / campaign_grouped['Spend'], 0.0)
    
    # We define wasted campaigns as those with Spend > 0 and ROI < 1.0 (spending more than earning)
    wasted_camps_df = campaign_grouped[(campaign_grouped['Spend'] > 100) & (campaign_grouped['roi'] < 1.0)]
    wasted_camps_df = wasted_camps_df.sort_values(by='roi')
    
    total_wasted = float(wasted_camps_df['Spend'].sum())
    wasted_count = len(wasted_camps_df)
    
    wasted_campaigns = []
    for _, row in wasted_camps_df.iterrows():
        # Action recommendation
        if row['Conversions'] == 0:
            rec_action = "Pause campaign immediately as it is generating zero conversions."
        elif row['roi'] < 0.5:
            rec_action = "Decrease budget by 50% or refine search matches to reduce waste."
        else:
            rec_action = "Audit ad copy and landing page matching to lift conversions."
            
        wasted_campaigns.append({
            'campaign': str(row['Campaign']),
            'channel': str(row['Channel']),
            'spend': float(row['Spend']),
            'roi': float(row['roi']),
            'conversions': int(row['Conversions']),
            'reason': rec_action
        })
        
    wasted_spend = {
        'totalWasted': total_wasted,
        'wastedCount': wasted_count,
        'wastedCampaigns': wasted_campaigns
    }
    
    # 6. Top Performing Campaigns
    top_camps_df = campaign_grouped[campaign_grouped['Spend'] > 100]
    top_camps_df = top_camps_df.sort_values(by='roi', ascending=False)
    
    top_campaigns = []
    for _, row in top_camps_df.head(5).iterrows():
        cpa = (row['Spend'] / row['Conversions']) if row['Conversions'] > 0 else 0.0
        top_campaigns.append({
            'campaign': str(row['Campaign']),
            'channel': str(row['Channel']),
            'spend': float(row['Spend']),
            'revenue': float(row['Revenue']),
            'roi': float(row['roi']),
            'conversions': int(row['Conversions']),
            'cpa': float(cpa)
        })
        
    return {
        'kpis': {
            'totalSpend': total_spend,
            'totalRevenue': total_revenue,
            'roi': roi,
            'conversions': conversions,
            'avgCpa': avg_cpa
        },
        'charts': {
            'campaignTimeData': campaign_time_data,
            'channelData': channel_data
        },
        'budgetOptimization': budget_opt,
        'wastedSpend': wasted_spend,
        'topCampaigns': top_campaigns
    }

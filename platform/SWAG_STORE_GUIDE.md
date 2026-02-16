# How to Create a Company Swag Store

This guide explains how to set up a swag store for your company on the Goodies platform.

## Overview

Each company can have their own public swag store accessible at:
```
https://yourdomain.com/companies/{store-identifier}
```

## Step 1: Create or Edit Company

1. Navigate to **Companies** in the sidebar (Admin/Super Admin only)
2. Either create a new company or edit an existing one
3. Fill in company details including:
   - Company Name
   - Domain (optional)
   - Tax ID (optional)
   - Currency
   - Billing Address

## Step 2: Configure Swag Store Settings

1. Go to **Settings** → **Swag Store Settings**
2. Or edit the company and configure:
   - **Store Identifier**: A unique identifier for your store URL
     - Example: `acme-inc` → Store URL: `/companies/acme-inc`
     - If not set, one will be auto-generated from company name

## Step 3: Add Products to Store

1. Navigate to **Products**
2. Create products and assign them to your company
3. Products assigned to your company will appear in your swag store
4. Add product images for better presentation
5. Set prices in your company's currency

## Step 4: Access Your Store

```
https://yourdomain.com/companies/{your-store-identifier}
```

## Store Features

- **Public Access**: Anyone with the URL can view products
- **Company Branding**: Shows your company name and products
- **Product Catalog**: Displays all products assigned to your company
- **Currency Display**: Shows prices in your company's currency

## Managing Store Settings

### For Super Admin:
- Can create stores for any company
- Can edit any company's store settings

### For Company HR:
- Can edit their own company's store settings
- Can configure store identifier
- Can manage products for their store

## Best Practices

1. **Store Identifier**: Use a short, memorable identifier
   - Good: `acme`, `techcorp`, `startup-2024`
   - Avoid: Long names with special characters

2. **Products**: 
   - Add high-quality product images
   - Write clear product descriptions
   - Set appropriate prices

3. **Currency**: 
   - Set currency that matches your billing
   - All products will display in this currency

## Troubleshooting

### Store Not Accessible
- Check that store identifier is set
- Verify company exists and is active
- Ensure products are assigned to the company

### Products Not Showing
- Verify products are assigned to your company
- Check product status (should be active)
- Ensure products have stock or are available

## Example Workflow

1. **Company HR creates company**: "Acme Inc"
2. **Company HR sets store identifier**: "acme"
3. **Company HR adds products**: 5 products assigned to Acme Inc
4. **Store is live**: `https://yourdomain.com/companies/acme`

## API Access

The swag store is a public page that can be:
- Embedded in iframes
- Shared via direct links
- Customized with company branding
- Accessed without authentication

## Support

For issues or questions about swag stores, contact your platform administrator.

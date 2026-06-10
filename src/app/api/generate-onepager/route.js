import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import OnePagerPDF from '@/components/onepager/OnePagerPDF';
import { serverFetch } from '@/services/api';
import { fetchBreReportData } from '@/app/actions';
import { Readable } from 'stream';

export async function POST(req) {
  try {
    const { msmeId } = await req.json();
    const appId='MSME1212002100'
    if (!msmeId || !appId) {
      return NextResponse.json({ error: 'Missing IDs' }, { status: 400 });
    }

    // Fetch data using secure serverFetch (hides backend APIs from browser)
    const summaryResp = await serverFetch(`getSummary/${msmeId}`);
    const combinedResp = await fetchBreReportData(appId);
    const imgResp = await serverFetch(`webGetBusinessImage/${msmeId}`);

    if (!summaryResp || !combinedResp) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    const summary = (Array.isArray(summaryResp.data) ? summaryResp.data[0] : summaryResp.data) || {};
    const combined = combinedResp.data || {};
    const images = (Array.isArray(imgResp?.data) ? imgResp.data[0] : imgResp?.data) || {};

    // Helper to extract clean base64 string
    const getCleanBase64 = (b64) => {
      if (!b64) return null;
      let cleanStr = String(b64).trim().replace(/^['"]+|['"]+$/g, '').replace(/(\r\n|\n|\r)/gm, "");
      if (cleanStr.startsWith('data:image')) {
        const parts = cleanStr.split(',');
        return parts.length > 1 ? parts[1] : null;
      }
      return cleanStr;
    };

    // Helper to convert base64 to Node Buffer for robust React-PDF rendering
    const getBufferImage = (b64) => {
      const cleanBase64 = getCleanBase64(b64);
      if (!cleanBase64) return null;
      try {
        return { data: Buffer.from(cleanBase64, 'base64'), format: 'jpg' };
      } catch (e) {
        return null;
      }
    };

    const combinedCustomerData = combined.CUSTOMER_DATA || {};
    
    // Construct the exact data object for the PDF
    const dataObj = {
      ...combinedCustomerData,
      ...(combined.BRANCH_DATA || {}),
      ...(combined.GST_DATA || {}),
      ...(combined.ACCOUNT_AGGREGATOR_DATA || {}),
      ...summary,
      application_id: appId,
      // Replace raw Base64 with solid Node Buffer objects
      customer_photo: getBufferImage(combinedCustomerData.customer_photo || summary.customer_photo || images.customer_photo),
      business_image: getBufferImage(combinedCustomerData.business_image || summary.business_image || images.business_image),
      business_image_1: getBufferImage(combinedCustomerData.business_image_1 || summary.business_image_1 || images.business_image_1),
      business_image_2: getBufferImage(combinedCustomerData.business_image_2 || summary.business_image_2 || images.business_image_2),
      business_image_3: getBufferImage(combinedCustomerData.business_image_3 || summary.business_image_3 || images.business_image_3),
      business_image_4: getBufferImage(combinedCustomerData.business_image_4 || summary.business_image_4 || images.business_image_4),
    };

    const msmedata = { ...(combined.BUREAU_DATA || {}) };
    const googleData = combined.GOOGLE_DATA || {};
    const bredata = googleData.BRE_DETAILS || [];

    // Render the PDF securely on the backend Server
    const nodeStream = await renderToStream(
      <OnePagerPDF
        data={dataObj}
        msmedata={msmedata}
        bredata={bredata}
        google={googleData}
      />
    );

    // Convert Node Stream to Web Stream for Next.js Edge compatibility
    const webStream = Readable.toWeb(nodeStream);

    // Return pure binary PDF file to the browser
    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="OnePager_${appId}.pdf"`,
      },
    });

  } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error('PDF Generation API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

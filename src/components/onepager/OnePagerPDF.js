import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 80,
        backgroundColor: '#f8f9fa',
        fontFamily: 'Helvetica',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    labelValueRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    label: {
        fontSize: 10,
        color: '#2c3e50',
        width: '30%',
        padding: 5,
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
    },
    value: {
        fontSize: 10,
        color: '#2c3e50',
        width: '70%',
        padding: 5,
    },
    section: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 5,
    },
    subheading: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#34495e',
        marginTop: 10,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 5,
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCol: {
        width: '16.6%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    tableCell: {
        margin: 5,
        fontSize: 10,
        color: '#2c3e50',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#3498db',
    },
    footer: {
        marginTop: 30,
        textAlign: 'center',
        fontSize: 10,
        color: '#95a5a6',
    },
    footercom: {
        marginTop: 5,
        textAlign: 'center',
        fontSize: 10,
        color: '#95a5a6',
    },
    coordinates: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 3,
    },
    coordinateText: {
        fontSize: 10,
        color: '#2c3e50',
        marginHorizontal: 5,
    },
});

const OnePagerPDF = ({ data, msmedata, bredata, google }) => {
    const totalMonths = msmedata?.Column3 || 0;


    function convertMonthsToYears(totalMonths) {
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        return { years, months };
    }
    const formatNestedObject = (obj) => {
        if (!obj || typeof obj !== "object") return "N/A";

        const inner = Object.values(obj)[0];
        if (typeof inner !== "object") return String(inner);

        return Object.entries(inner)
            .map(([month, info]) => {
                if (typeof info === "object")
                    return `${month}: Credit=${info.NumCreditTrx}, Debit=${info.NumDebitTrx}`;
                return `${month}: ${info}`;
            })
            .join(" | ");
    };

    const formatMonthlyTransactions = (data, type) => {
        if (!data) return [];
        return Object.keys(data).map(month => {
            const entry = data[month];
            if (!entry) return null;
            return {
                month,
                value: type === 'credit' ? entry.NumCreditTrx || 0 : entry.NumDebitTrx || 0,
            };
        }).filter(Boolean);
    };


    return (
        <Document>

            <Page size="A4" style={styles.page}>
                <Text style={styles.heading}>MSME Loan Application - {data?.application_id || 'N/A'}</Text>

                <View style={styles.section}>
                    <Text style={styles.subheading}>Customer Information</Text>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Customer Name:</Text>
                        <Text style={styles.value}>{data?.full_name || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Aadhar Name:</Text>
                        <Text style={styles.value}>{data?.full_name || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>UDYAM Name:</Text>
                        <Text style={styles.value}>{data?.udyam_name || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Mobile Number:</Text>
                        <Text style={styles.value}>{data?.mobile_no || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Own Property:</Text>
                        <Text style={styles.value}>NO</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subheading}>Addresses</Text>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Permanent Address:</Text>
                        <Text style={styles.value}>
                            {[
                                data?.a_address_line1,
                                data?.a_address_line2,
                                data?.a_address_line3,
                                data?.a_address_city,
                                data?.a_address_state,
                                `PIN Code - ${data?.a_address_pincode}`
                            ].filter(Boolean).join(', ') || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Current Address:</Text>
                        <Text style={styles.value}>
                            {[
                                data?.c_address_line1,
                                data?.c_address_line2,
                                data?.c_address_line3,
                                data?.c_address_city,
                                data?.c_address_state,
                                `PIN Code - ${data?.c_address_pincode}`
                            ].filter(Boolean).join(', ') || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Business Address:</Text>
                        <Text style={styles.value}>
                            {[
                                data?.business_address,
                                data?.business_city,
                                data?.business_state,
                                `PIN Code - ${data?.business_pincode}`
                            ].filter(Boolean).join(', ') || 'N/A'}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subheading}>Business Information</Text>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>UDYAM Number:</Text>
                        <Text style={styles.value}>{data?.udhyam_no || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Entity Type:</Text>
                        <Text style={styles.value}>{data?.udyam_entity_type || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Incorporation Date:</Text>
                        <Text style={styles.value}>{data?.udyam_incorp_date || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Date Created:</Text>
                        <Text style={styles.value}>{data?.created_on || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Business Name User:</Text>
                        <Text style={styles.value}>{data?.udyam_name || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Final Loan Amount (Rs):</Text>
                        <Text style={styles.value}>
                            {data?.final_loan_amount ? new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(data.final_loan_amount) : 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Loan duration (months):</Text>
                        <Text style={styles.value}>{data?.loan_total_duration_in_months || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Interest Rate (%):</Text>
                        <Text style={styles.value}>{data?.loan_interest_rate || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subheading}>BRE Information</Text>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Eligibility Criteria:</Text>
                        <Text style={styles.value}>{msmedata?.ELIGIBILITY_CRITERIA || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>CRIF Score:</Text>
                        <Text style={styles.value}>{msmedata?.SCORE_VALUE || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Bureau Vintage:</Text>
                        {/* <Text style={styles.value}>{totalMonths ? `${convertMonthsToYears(totalMonths).years} years ${convertMonthsToYears(totalMonths).months} months` : 'N/A'}</Text> */}
                        <Text style={styles.value}>{msmedata?.BUREAU_VINTAGE || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Total Loans Taken:</Text>
                        <Text style={styles.value}>
                            {msmedata?.TOTAL_LOANS_TAKEN || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Total Active Loans:</Text>
                        <Text style={styles.value}>
                            {msmedata?.TOTAL_ACTIVE_LOAN || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Total Loan Amount (Rs):</Text>
                        <Text style={styles.value}>

                            {msmedata?.TOTAL_LOAN_AMOUNT_RS || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Current Outstanding Amount (Rs):</Text>
                        <Text style={styles.value}>
                            {msmedata?.CURRENT_OUTSTANDING_RS || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Highest Loan, Disbursement Date, POS:</Text>
                        <Text style={styles.value}>{msmedata?.HIGHEST_LOAN || 'N/A'}/{msmedata?.DISBURSED_DATE_OF_HIGHEST_LOAN || 'N/A'}/{msmedata?.CURRENT_BALANCE_OF_HIGHEST_LOAN || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Account Type of Highest Loan:</Text>
                        <Text style={styles.value}>{msmedata?.ACCOUNT_TYPE_OF_HIGHEST_LOAN || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Status of Highest Loan:</Text>
                        <Text style={styles.value}>{msmedata?.ACCOUNT_STATUS_OF_HIGHEST_LOAN || 'N/A'}</Text>
                    </View>

                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Distance to nearest branch(KM):</Text>
                        <Text style={styles.value}>{data?.DISTANCE_TO_NEAREST_BRANCH_KM || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Nearest Branch Name:</Text>
                        <Text style={styles.value}>{data?.NEAREST_BRANCH_NAME || 'N/A'}</Text>
                    </View>

                    {/* <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Number Of Application Using Same Mobile No</Text>
                        <Text style={styles.value}>{data?.DISTINCT_APP_COUNT_BY_MOBILE_NO || 'N/A'}</Text>
                    </View> */}
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Number Of Application In 100 M LAT Long</Text>
                        <Text style={styles.value}>{`${data?.NEARBY_APP_COUNT }`|| 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Credit Comment:</Text>
                        <Text style={styles.value}>{data?.credit_comment || 'N/A'}</Text>
                    </View>
                </View>
                {/* // 49473 google review section */}
                <View style={styles.section}>
                    <Text style={styles.subheading}>Google Review Section</Text>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Google Business Name</Text>
                        <Text style={styles.value}>{google?.GOOGLE_BUSINESS_NAME || 'N/A'}</Text>
                    </View>

                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Google Business Address</Text>
                        <Text style={styles.value}>{google?.GOOGLE_BUSINESS_ADDRESS || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Google Phone Number</Text>
                        <Text style={styles.value}>{google?.GOOGLE_PHONE_NUMBER || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Google Business Status</Text>
                        <Text style={styles.value}>{google?.BUSINESS_STATUS || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Google Rating:</Text>
                        <Text style={styles.value}>{google?.GOOGLE_OVERALL_REVIEW_RATING || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Google Review Count:</Text>
                        <Text style={styles.value}>{google?.USER_RATING_TOTAL || 'N/A'}</Text>
                    </View>
                    {/* <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Google Overall Review Rating</Text>
                        <Text style={styles.value}>{google ?.Google_Overall_Review_Rating || 'N/A'}</Text>
                    </View> */}
                </View>
                {/* // 49473 Account Aggregator Section */}
                <View style={styles.section}>
                    <Text style={styles.subheading}>Account Aggregator Info Section</Text>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>AA_Eligible_Amt</Text>
                        <Text style={styles.value}>{data?.AA_ELIGIBLE_AMOUNT || 'N/A'}</Text>
                    </View>

                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>EMI bounces (due to IF) in last 6 months</Text>
                        <Text style={styles.value}>{data?.NUMBER_OF_EMI_BOUNCES || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Turnover to UBL POS</Text>
                        <Text style={styles.value}>{data?.TURNOVER_RATIO_PERCENT || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Inward cheque returns</Text>
                        <Text style={styles.value}>{data?.['INWARD_CHEQUE_RETURN_LESSTHAN_3%'] || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>#Credit Transactions</Text>
                        <Text style={styles.value}>{data?.["2_DEBIT_AND_2_CREDIT_IN_6MONTH"] &&
                            Object.values(data["2_DEBIT_AND_2_CREDIT_IN_6MONTH"])[0] // get inner object
                            ? Object.entries(Object.values(data["2_DEBIT_AND_2_CREDIT_IN_6MONTH"])[0])
                                .map(([month, info]) => `${month}: ${info.NumCreditTrx || 0}`)
                                .join(' | ')
                            : 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>#Debit Transactions</Text>
                        <Text style={styles.value}>{data?.["2_DEBIT_AND_2_CREDIT_IN_6MONTH"] &&
                            Object.values(data["2_DEBIT_AND_2_CREDIT_IN_6MONTH"])[0] // get inner object
                            ? Object.entries(Object.values(data["2_DEBIT_AND_2_CREDIT_IN_6MONTH"])[0])
                                .map(([month, info]) => `${month}: ${info.NumDebitTrx || 0}`)
                                .join(' | ')
                            : 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Average Bank Balance</Text>
                        <Text style={styles.value}>{formatNestedObject(data?.ACCT_WISE_MONTHLY_BALANCE_DATA)}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>6 Months bank Statement Available</Text>
                        <Text style={styles.value}>{data?.MINIMUM_TRX_HISTORY_6MONTH_TAG || 'N/A'}</Text>
                    </View>

                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Monthly Average credit of last six months</Text>
                        <Text style={styles.value}>{formatNestedObject(data?.MINIMUM_AVERAGE_CREDIT_TRX_VALUE || 'N/A')}</Text>
                    </View>
                    

                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Annual turnover to loan amount</Text>
                        <Text style={styles.value}>{data?.ANNUAL_TURNOVER_AMT || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Loan RTR</Text>
                        <Text style={styles.value}>{data?.CLEAN_TARGAET_LOAN || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Bureau_Obligation</Text>
                        <Text style={styles.value}>{data?.SUM_ACTIVE_OBLIGATIONS_BUREAU || 'N/A'}</Text>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Obligation Paid from ABB</Text>
                        <Text style={styles.value}>{data?.SUM_ACTIVE_OBLIGATIONS_BUREAU || 'N/A'}</Text>
                    </View>
                </View>
{/* 
                <View style={styles.section}>
                    <Text style={styles.subheading}>BRE DATA</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Type of loan</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Loan Date</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Loan Amount</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>POS</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Account Status</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Loan Vintage(months)</Text>
                            </View>
                        </View>
                        {data?.MULTI_COLUMN_FETCH &&
            Object.keys(data.MULTI_COLUMN_FETCH).length > 0 ? (
                            Object.values(data.MULTI_COLUMN_FETCH).map((item, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{item.Acct_Type || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{item.ACCOUNT_OPENED_DATE || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{item.Disbursed_Amt || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{item.Current_Bal || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{item.Account_Status || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{item.Loan_Vintage || 'N/A'}</Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        No BRE data available
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View> */}
                <View style={styles.section}>
    <Text style={styles.subheading}>BRE DATA</Text>

    <View style={styles.table}>

        {/* HEADER */}
        <View style={styles.tableRow}>
            <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Type of loan</Text>
            </View>
            <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Loan Date</Text>
            </View>
            <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Loan Amount</Text>
            </View>
            <View style={styles.tableCol}>
                <Text style={styles.tableCell}>POS</Text>
            </View>
            <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Account Status</Text>
            </View>
            <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Loan Vintage(months)</Text>
            </View>
        </View>

        {(() => {
            const cols = msmedata?.MULTI_COLUMN_FETCH;

            if (!cols || Object.keys(cols).length === 0) {
                return (
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>No BRE data available</Text>
                        </View>
                    </View>
                );
            }

            const colNames = Object.keys(cols);
            const rowCount = cols[colNames[0]].length;

            const rowData = [];

            for (let i = 0; i < rowCount; i++) {
                const row = {};
                colNames.forEach(col => {
                    row[col] = cols[col][i];
                });
                rowData.push(row);
            }

            return rowData.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                            {item.ACCOUNT_TYPE_AGG || "N/A"}
                        </Text>
                    </View>

                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                            {item.ACCOUNT_OPENED_DATE || "N/A"}
                        </Text>
                    </View>

                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                            {item.CREDIT_MIX || "N/A"}
                        </Text>
                    </View>

                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                            {item.CURRENT_OUTSTANDING || "N/A"}
                        </Text>
                    </View>

                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                            {item.ACCOUNT_STATUS || "N/A"}
                        </Text>
                    </View>

                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                            {item.ACCOUNT_AGE || item.TENURE || "N/A"}
                        </Text>
                    </View>
                </View>
            ));
        })()}

    </View>
</View>

                <View style={styles.section}>
                    <Text style={styles.subheading}>Images</Text>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Customer Image:</Text>
                        <View style={styles.value}>
                            {data?.customer_photo ? (
                                <Image style={styles.image} src={data?.customer_photo} />
                            ) : (
                                <Text>No Customer Image</Text>
                            )}
                            <View style={styles.coordinates}>
                                <Text style={styles.coordinateText}>Lat: {data?.latitude || 'N/A'}</Text>
                                <Text style={styles.coordinateText}>Long: {data?.longitude || 'N/A'}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.labelValueRow}>
                        <Text style={styles.label}>Business Image:</Text>
                        <View style={styles.value}>
                            {data?.business_image ? (
                                <Image style={styles.image} src={data?.business_image} />
                            ) : (
                                <Text>No Business Image</Text>
                            )}
                            <View style={styles.coordinates}>
                                <Text style={styles.coordinateText}>Lat: {data?.business_lat || 'N/A'}</Text>
                                <Text style={styles.coordinateText}>Long: {data?.business_long || 'N/A'}</Text>
                            </View>
                        </View>
                    </View>
                    {data?.business_image_1 ? (
                        <View style={styles.labelValueRow}>
                            <Text style={styles.label}>Business Image 1:</Text>
                            <View style={styles.value}>
                                <Image style={styles.image} src={data?.business_image_1} />
                            </View>
                        </View>
                    ) : null}
                    {data?.business_image_2 ? (
                        <View style={styles.labelValueRow}>
                            <Text style={styles.label}>Business Image 2:</Text>
                            <View style={styles.value}>
                                <Image style={styles.image} src={data?.business_image_2} />
                            </View>
                        </View>
                    ) : null}
                    {data?.business_image_3 ? (
                        <View style={styles.labelValueRow}>
                            <Text style={styles.label}>Business Image 3:</Text>
                            <View style={styles.value}>
                                <Image style={styles.image} src={data?.business_image_3} />
                            </View>
                        </View>
                    ) : null}
                    {data?.business_image_4 ? (
                        <View style={styles.labelValueRow}>
                            <Text style={styles.label}>Business Image 4:</Text>
                            <View style={styles.value}>
                                <Image style={styles.image} src={data?.business_image_4} />
                            </View>
                        </View>
                    ) : null}
                </View>


                <Text style={styles.footer}>Suryoday Small Finance Bank Ltd</Text>
                <Text style={styles.footercom}>A Bank of Smiles</Text>
            </Page>
        </Document>
    );
}

export default OnePagerPDF;
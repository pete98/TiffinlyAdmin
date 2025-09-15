import { Suspense } from "react";

interface ReferralPageProps {
  params: {
    code: string;
  };
  searchParams: {
    referrer?: string;
  };
}

function ReferralContent({ code, referrer }: { code: string; referrer?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Referral Captured
        </h1>
        <p className="text-gray-600 mb-4">
          Referral code: <span className="font-mono font-semibold">{code}</span>
        </p>
        {referrer && (
          <p className="text-gray-600 mb-4">
            Referrer: <span className="font-semibold">{referrer}</span>
          </p>
        )}
        <p className="text-sm text-gray-500">
          TODO: Wire to backend for actual referral processing
        </p>
      </div>
    </div>
  );
}

export default function ReferralPage({ params, searchParams }: ReferralPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReferralContent 
        code={params.code} 
        referrer={searchParams.referrer} 
      />
    </Suspense>
  );
}

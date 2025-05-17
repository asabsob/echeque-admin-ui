export default function ChequeCard() {
  return (
    <div
      className="relative w-[900px] h-[250px] bg-no-repeat bg-cover mb-6"
      style={{ backgroundImage: "url('/cheque-template.png')" }}
    >
      <div className="absolute top-[20px] left-[30px] text-sm font-semibold">
        Cheque #: 12345
      </div>
      <div className="absolute top-[50px] left-[30px] text-sm">
        Pay To: Fatima R
      </div>
      <div className="absolute top-[80px] left-[30px] text-sm">
        JD 1,000,000
      </div>
      <div className="absolute top-[110px] left-[30px] text-sm">
        Date: 2025-05-17
      </div>
      <div className="absolute top-[140px] left-[30px] text-sm">
        Expiry: 2025-06-17
      </div>
    </div>
  );
}

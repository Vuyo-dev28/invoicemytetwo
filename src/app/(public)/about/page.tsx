import { Zap, BarChart, FileText, Users, Code, Smile } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative z-10 py-20 px-4 w-full">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
          About InvoiceMyte
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Empowering freelancers and small businesses to thrive.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-md rounded-xl shadow-lg p-8 md:p-12 border">
        <div className="text-left space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground text-lg">
              We are a passionate team dedicated to building tools that empower freelancers and small business owners. We believe that managing your finances should be simple, intuitive, and stress-free. InvoiceMyte was born from the idea that you should be able to focus on what you do best—not on paperwork. Our goal is to provide a powerful, easy-to-use platform that saves you time, helps you get paid faster, and gives you a clear picture of your financial health.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card/50 p-6 rounded-lg border">
                <Zap className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Efficiency First</h3>
                <p className="text-muted-foreground">Streamline your workflow from creating invoices to getting paid. We design every feature to be fast and intuitive.</p>
              </div>
              <div className="bg-card/50 p-6 rounded-lg border">
                <BarChart className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Financial Clarity</h3>
                <p className="text-muted-foreground">Gain insights into your cash flow and business performance with our straightforward analytics.</p>
              </div>
              <div className="bg-card/50 p-6 rounded-lg border">
                <FileText className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Professionalism</h3>
                <p className="text-muted-foreground">Create beautiful, professional documents that impress your clients and represent your brand.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Meet the (Fictional) Team</h2>
            <p className="text-muted-foreground text-lg mb-8">
              InvoiceMyte is brought to you by a dynamic duo of developers and designers who are also freelancers. We built the tool we always wished we had.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <div className="text-center">
                 <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Code className="w-12 h-12 text-primary" />
                 </div>
                <h4 className="font-bold text-lg">Alex Doe</h4>
                <p className="text-muted-foreground">Lead Developer</p>
              </div>
              <div className="text-center">
                 <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Smile className="w-12 h-12 text-primary" />
                 </div>
                <h4 className="font-bold text-lg">Jordan Smith</h4>
                <p className="text-muted-foreground">UI/UX Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

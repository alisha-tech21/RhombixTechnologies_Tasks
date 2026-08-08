import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import api from "../../services/api";
import "../../styles/auth.css";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify-email/${token}`);
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification link is invalid or has expired",
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="password-card" style={{ textAlign: "center" }}>
        <div className="auth-brand" style={{ justifyContent: "center" }}>
          <div className="brand-icon">C</div>
          <span>Connectify</span>
        </div>

        {status === "loading" && (
          <>
            <Loader2
              size={40}
              className="spin"
              style={{ margin: "20px auto", color: "var(--indigo-600)" }}
            />
            <p>Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2
              size={40}
              style={{ margin: "20px auto", color: "#10b981" }}
            />
            <h1 style={{ fontSize: 20, marginBottom: 8 }}>Email Verified!</h1>
            <p style={{ color: "var(--slate-500)", marginBottom: 20 }}>
              {message}
            </p>
            <Link
              to="/login"
              className="auth-submit"
              style={{ display: "block", textDecoration: "none" }}
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle
              size={40}
              style={{ margin: "20px auto", color: "#ef4444" }}
            />
            <h1 style={{ fontSize: 20, marginBottom: 8 }}>
              Verification Failed
            </h1>
            <p style={{ color: "var(--slate-500)", marginBottom: 20 }}>
              {message}
            </p>
            <Link
              to="/login"
              className="auth-switch"
              style={{ display: "block" }}
            >
              ← Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

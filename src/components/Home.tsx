import type { FC } from "hono/jsx";

export interface HomeProps {
	userIp: string;
	endpointsCount: number;
	pingMs: number;
	gitCommit: string;
}

export const Home: FC<HomeProps> = ({
	userIp,
	endpointsCount,
	pingMs,
	gitCommit,
}) => {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>TURU REST API</title>
				<style
					dangerouslySetInnerHTML={{
						__html: `
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #0f172a;
              color: #f8fafc;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
          }
          
          .container {
              background: #1e293b;
              border: 1px solid #334155;
              border-radius: 12px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
              max-width: 650px;
              width: 100%;
              padding: 40px;
              text-align: center;
          }
          
          h1 {
              color: #f1f5f9;
              margin-bottom: 10px;
              font-size: 2.5em;
          }
          
          .subtitle {
              color: #94a3b8;
              font-size: 1.1em;
              margin-bottom: 30px;
              font-style: italic;
          }
          
          .description {
              color: #cbd5e1;
              line-height: 1.6;
              margin-bottom: 30px;
              font-size: 1em;
          }
          
          .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 30px;
              text-align: left;
          }
          
          .info-item {
              background: #0f172a;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #ef4444;
          }
          
          .info-label {
              color: #64748b;
              font-size: 0.85em;
              text-transform: uppercase;
              margin-bottom: 5px;
              font-weight: 600;
          }
          
          .info-value {
              color: #f1f5f9;
              font-size: 1.1em;
              font-weight: 500;
              word-break: break-all;
          }
          
          .links {
              display: flex;
              gap: 15px;
              justify-content: center;
              flex-wrap: wrap;
              margin-top: 30px;
          }
          
          a {
              display: inline-block;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 600;
              transition: all 0.3s ease;
              font-size: 0.95em;
          }
          
          .btn-primary {
              background: #ef4444;
              color: white;
          }
          
          .btn-primary:hover {
              background: #dc2626;
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4);
          }
          
          .btn-secondary {
              background: #334155;
              color: white;
          }
          
          .btn-secondary:hover {
              background: #1e293b;
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          
          .status {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #334155;
          }
          
          .status-badge {
              display: inline-block;
              background: #ef4444;
              color: white;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 0.85em;
              font-weight: 600;
          }
          
          @media (max-width: 600px) {
              h1 {
                  font-size: 1.8em;
              }
              
              .info-grid {
                  grid-template-columns: 1fr;
              }
              
              .container {
                  padding: 30px 20px;
              }
          }
        `,
					}}
				/>
			</head>
			<body>
				<div className="container">
					<h1>🌙 TURU REST API</h1>
					<p className="subtitle">Free REST API for lazy people</p>

					<p className="description">
						TURU means "sleep" in Indonesian (Javanese language). This is a free
						REST API for those who want to get things done without much effort.
					</p>

					<div className="info-grid">
						<div className="info-item">
							<div className="info-label">Version</div>
							<div className="info-value">0.1.2</div>
						</div>
						<div className="info-item">
							<div className="info-label">Author</div>
							<div className="info-value">indra87g</div>
						</div>
						<div className="info-item">
							<div className="info-label">User IP</div>
							<div className="info-value">{userIp}</div>
						</div>
						<div className="info-item">
							<div className="info-label">Endpoints</div>
							<div className="info-value">{endpointsCount}</div>
						</div>
						<div className="info-item">
							<div className="info-label">Ping</div>
							<div className="info-value">{pingMs} ms</div>
						</div>
						<div className="info-item">
							<div className="info-label">Git Commit</div>
							<div className="info-value" style={{ fontSize: "0.9em" }}>
								{gitCommit}
							</div>
						</div>
					</div>

					<div className="links">
						<a href="/docs" className="btn-primary">
							📚 API Documentation
						</a>
						<a href="/api" className="btn-secondary">
							⚙️ API Info
						</a>
						<a
							href="https://github.com/indra87g/turu-api"
							className="btn-secondary"
							target="_blank"
							rel="noreferrer"
						>
							🐙 GitHub
						</a>
					</div>

					<div className="status">
						<span className="status-badge">✓ Server Running</span>
					</div>
				</div>
			</body>
		</html>
	);
};

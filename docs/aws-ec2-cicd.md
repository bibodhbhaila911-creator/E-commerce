# CI/CD: Ecommerce → AWS EC2 (CloudFormation + GitHub Actions)

Workflow: [.github/workflows/deploy-ec2.yml](../.github/workflows/deploy-ec2.yml)
Template: [infra/ec2-instance.yaml](../infra/ec2-instance.yaml)
Server setup script: [infra/remote-deploy.sh](../infra/remote-deploy.sh)

The existing Vercel (backend) and GitHub Pages (frontend) setups are not touched. This is an additional, separate deployment target.

## Architecture

```
Browser ──► EC2 :80  nginx
                    ├── /        → React build (ecommerce/frontend/dist)
                    └── /api/*   → Express backend on 127.0.0.1:8000 (systemd: ecommerce-backend)
                                      └── MongoDB (local mongod, or MONGO_URL secret e.g. Atlas)
```

## Pipeline

| Job | Runs on | Needs AWS creds? | What it does |
|---|---|---|---|
| **Build & lint** | push, PR, manual | No | `npm ci`, backend syntax check, frontend lint, `vite build --base=/` with `VITE_API_URL=/api`, packages a release tarball |
| **Provision EC2 & deploy** | push to `main`, manual | Yes | Validates + deploys the CloudFormation stack `ecommerce-ec2-stack`, gets the SSH key from SSM, uploads the release, runs `remote-deploy.sh` (installs Node 22, nginx, MongoDB if needed, then restarts the app), smoke tests `/` and `/api/product` |

Triggers: pushes to `main` that change `ecommerce/**`, `infra/**` or the workflow file, and **Actions → CI/CD - Ecommerce to AWS EC2 → Run workflow**.

## GitHub secrets (Settings → Secrets and variables → Actions)

| Secret | Required | Value |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | yes | Lab access key |
| `AWS_SECRET_ACCESS_KEY` | yes | Lab secret key |
| `AWS_SESSION_TOKEN` | yes for temporary/lab creds | Lab session token (AWS Academy / Learner Lab creds always include one) |
| `MONGO_URL` | optional | e.g. MongoDB Atlas URI. If not set, MongoDB is installed on the EC2 instance itself |

The lab credentials expire (about every 3 hours). Update all three AWS secrets whenever you start a new session, then re-run the workflow. If they expire, the **Configure AWS credentials** step fails with `ExpiredToken` / `InvalidClientTokenId`. Update the secrets and click **Re-run failed jobs**.

If you use Atlas, add the EC2 public IP (or `0.0.0.0/0`) to the Atlas Network Access list.

## Region

The default is `us-east-1`. Change `AWS_REGION` in the workflow `env` block if your lab uses another region.

## SSH into the server (optional)

```bash
KEY_ID=<KeyPairId from the run summary>
aws ssm get-parameter --name /ec2/keypair/$KEY_ID --with-decryption \
  --query Parameter.Value --output text --region us-east-1 > ec2-key.pem
chmod 400 ec2-key.pem
ssh -i ec2-key.pem ec2-user@<PublicIp>

# useful on the box
sudo systemctl status ecommerce-backend
sudo journalctl -u ecommerce-backend -f
```

## Notes

- **Data**: with local MongoDB, data lives on the instance disk. It is lost if the stack or instance is deleted or replaced. Use `MONGO_URL` (Atlas) to keep data independent of the server.
- **IP changes**: there is no Elastic IP, so the public IP/DNS can change if the instance is stopped/started (e.g. when a lab session ends). The run summary always shows the current URL.
- **Instance type**: pushes deploy `t2.micro`. A manual run lets you pick another size, but the next push sets it back to `t2.micro`.
- **Rollback**: the previous release is kept at `/opt/ecommerce.old` on the server. Alternatively, re-run an older successful workflow run.
- **Stack in `ROLLBACK_COMPLETE`**: delete it in the CloudFormation console, then re-run the workflow.
- **Cleanup**: delete the `ecommerce-ec2-stack` stack in CloudFormation to remove everything.
